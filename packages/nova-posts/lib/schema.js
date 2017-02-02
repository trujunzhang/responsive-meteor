import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Posts from './collection.js';

import Topics from 'meteor/nova:topics';

/**
 * @summary Posts config namespace
 * @type {Object}
 */
Posts.config = {};

//A: which status of the post submitted by user?
//B: Pending
//   Someone will check the content and approve it
//   If the content is not good, it will be rejected
//A: you will approve the posts which status is pending?
//B: Yes
//A: which status of the posts is set from the flag on the detail page?
//B: Can you make a new status = Flagged?
//A: ok, i add a new status called Posts.config.STATUS_FLAGGED.
//A: move to trash on the wordpress, move to which status on my web app?
//B: Move to Trash is delete(Posts.config.STATUS_DELETED).
//Note: Approved is when the article is published
//      Pending is when someone submits an article

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2; // it means that the posts are published.
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4; // it means that the posts are moved to trash, the same as STATUS_DRAFT.
Posts.config.STATUS_DELETED = 5;

Posts.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.

Posts.config.STATUS_UI_ALERT= 8; // Special status, just for the posts that no permission to view.

Posts.config.ALL_STATUS = [
    Posts.config.STATUS_PENDING,
    Posts.config.STATUS_APPROVED,
    Posts.config.STATUS_REJECTED,
    Posts.config.STATUS_SPAM,
    Posts.config.STATUS_DELETED
];

Posts.config.ALL_STATUS_FOR_USER_PROFILE = [
    Posts.config.STATUS_PENDING,
    Posts.config.STATUS_APPROVED,
    Posts.config.STATUS_REJECTED,
    Posts.config.STATUS_SPAM,
    Posts.config.STATUS_DELETED,
    Posts.config.STATUS_REMOVED
];

Posts.config.PUBLISH_STATUS = [
    Posts.config.STATUS_PENDING,
    Posts.config.STATUS_APPROVED,
    Posts.config.STATUS_REJECTED,
    Posts.config.STATUS_SPAM
];

// 18/12/2016
// When the User clicks on this notification, the article opens up in a page.
// The user should also be able to see the status of the submitted article.
// There should be only 3 types of status for the user - Pending Approval, Approved, or Rejected.
// So that when the user opens the article, he knows whether the article has been approved or not.
Posts.config.STATUS_MESSAGE_TITLES = [
    "",
    'Pending Approval',
    'Approved',
    'Rejected',
    '',
    '',
    ''
];

Posts.config.STATUS_CHECKING= [
    "",
    'pending',
    'publish',
    'reject',
    'draft',
    'trash', // trash is the same as Deleted.
    'flag'
];

Posts.config.STATUS_TITLES = [
    "",
    'Approving',
    'Published',
    'Rejected',
    'Draft',
    'Trash', // trash is the same as Deleted.
    'Flagged'
];

Posts.formGroups = {
    admin: {
        name: "admin",
        order: 2
    }
};

// check if user can create a new post
const canInsert = user => Users.canDo(user, "posts.new");

// check if user can edit a post
const canEdit = Users.canEdit;

// check if user can edit *all* posts
const canEditAll = user => Users.canDo(user, "posts.edit.all");

/**
 * @summary Posts schema
 * @type {SimpleSchema}
 */
Posts.schemaJSON = {
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true
    },
    /**
     Timetstamp of post creation
     */
    createdAt: {
        type: Date,
        optional: true,
        publish: true // publish so that admins can sort pending posts by createdAt
    },
    /**
     Timestamp of post first appearing on the site (i.e. being approved)
     */
    postedAt: {
        type: Date,
        optional: true,
        insertableIf: canEditAll,
        editableIf: canEditAll,
        publish: true,
        control: "datetime",
        group: Posts.formGroups.admin
    },
    /**
     URL
     */
    url: {
        type: String,
        optional: true,
        max: 500,
        insertableIf: canInsert,
        editableIf: canEdit,
        control: "text",
        publish: true,
        order: 10
    },
    /**
     Title
     */
    title: {
        type: String,
        optional: true,
        max: 500,
        insertableIf: canInsert,
        editableIf: canEdit,
        control: "text",
        publish: true,
        order: 20
    },
    /**
     Slug
     */
    slug: {
        type: String,
        optional: true,
        publish: true,
    },
    /**
     Post body (markdown)
     */
    body: {
        type: String,
        optional: true,
        max: 3000,
        insertableIf: canInsert,
        editableIf: canEdit,
        control: "textarea",
        publish: true,
        order: 30
    },
    /**
     HTML version of the post body
     */
    htmlBody: {
        type: String,
        optional: true,
        publish: true,
    },
    /**
     Post Excerpt
     */
    excerpt: {
        type: String,
        optional: true,
        max: 255, //should not be changed the 255 is max we should load for each post/item
        publish: true,
    },
    /**
     Count of how many times the post's page was viewed
     */
    viewCount: {
        type: Number,
        optional: true,
        publish: true,
        defaultValue: 0
    },
    /**
     Timestamp of the last comment
     */
    lastCommentedAt: {
        type: Date,
        optional: true,
        publish: true,
    },
    /**
     Count of how many times the post's link was clicked
     */
    clickCount: {
        type: Number,
        optional: true,
        publish: true,
        defaultValue: 0
    },
    /**
     The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
     */
    status: {
        type: Number,
        optional: true,
        insertableIf: canEditAll,
        editableIf: canEditAll,
        control: "select",
        publish: true,
        autoValue: function () {
            // only provide a default value
            // 1) this is an insert operation
            // 2) status field is not set in the document being inserted
            let user = Meteor.users.findOne(this.userId);
            if (this.isInsert && !this.isSet)
                return Posts.getDefaultStatus(user);
        },
        form: {
            noselect: true,
            options: Telescope.statuses,
            group: 'admin'
        },
        group: Posts.formGroups.admin
    },
    lastStatus: {
        type: Number,
        optional: true,
        publish: false
    },
    /**
     Whether a post is scheduled in the future or not
     */
    //isFuture: {
    //    type: Boolean,
    //    optional: true,
    //    publish: true
    //},
    /**
     Whether the post is sticky (pinned to the top of posts lists)
     */
    sticky: {
        type: Boolean,
        optional: true,
        defaultValue: false,
        insertableIf: canEditAll,
        editableIf: canEditAll,
        control: "checkbox",
        publish: true,
        group: Posts.formGroups.admin
    },
    /**
     Whether the post is inactive. Inactive posts see their score recalculated less often
     */
    inactive: {
        type: Boolean,
        optional: true,
        publish: false,
        defaultValue: false
    },
    /**
     Save info for later spam checking on a post. We will use this for the akismet package
     */
    userIP: {
        type: String,
        optional: true,
        publish: false
    },
    userAgent: {
        type: String,
        optional: true,
        publish: false
    },
    referrer: {
        type: String,
        optional: true,
        publish: false
    },
    /**
     The post author's name
     */
    author: {
        type: String,
        optional: true,
        publish: true,
    },
    cloudinaryId: {
        type: String,
        optional: true,
        publish: true,
        defaultValue: ''
    },
    topics: {
        type: [String],
        optional: true,
        publish: true,
        join: {
            joinAs: "topicsArray",
            collection: () => Topics
        }
    },
    /**
     The post author's `_id`.
     */
    userId: {
        type: String,
        optional: true,
        // regEx: SimpleSchema.RegEx.Id,
        // insertableIf: canEditAll,
        // editableIf: canEditAll,
        control: "select",
        publish: true,
        form: {
            group: 'admin',
            options: function () {
                return Meteor.users.find().map(function (user) {
                    return {
                        value: user._id,
                        label: Users.getDisplayName(user)
                    };
                });
            }
        },
        join: {
            joinAs: "user",
            collection: () => Meteor.users
        }
    }
};

if (typeof SimpleSchema !== "undefined") {
    Posts.schema = new SimpleSchema(Posts.schemaJSON);
    Posts.attachSchema(Posts.schema);
}
