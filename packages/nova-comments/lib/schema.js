import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import Comments from './collection.js';

/**
 * @summary Comments config namespace
 * @type {Object}
 */
Comments.config = {};

Comments.config.STATUS_PENDING = 1;
Comments.config.STATUS_APPROVED = 2; // it means that the comments are published.
Comments.config.STATUS_REJECTED = 3;
Comments.config.STATUS_SPAM = 4; // it means that the comments are moved to trash, the same as STATUS_DRAFT.
Comments.config.STATUS_DELETED = 5; // it means that the current status is trash.

Comments.config.STATUS_REMOVED = 7; // Articles have been removed from the database, It means that no data to show.

Comments.config.ALL_STATUS = [
    Comments.config.STATUS_PENDING,
    Comments.config.STATUS_APPROVED,
    Comments.config.STATUS_REJECTED,
    Comments.config.STATUS_SPAM,
    Comments.config.STATUS_DELETED
];

Comments.config.ALL_STATUS_FOR_USER_PROFILE = [
    Comments.config.STATUS_PENDING,
    Comments.config.STATUS_APPROVED,
    Comments.config.STATUS_REJECTED,
    Comments.config.STATUS_SPAM,
    Comments.config.STATUS_DELETED,
    Comments.config.STATUS_REMOVED
];

Comments.config.PUBLISH_STATUS = [
    Comments.config.STATUS_PENDING,
    Comments.config.STATUS_APPROVED,
    Comments.config.STATUS_REJECTED
];

Comments.config.STATUS_MESSAGE_TITLES = [
    "",
    'Pending Approval',
    'Approved',
    'Rejected',
    '',
    '',
    ''
];

Comments.config.STATUS_TITLES = [
    "",
    'Approving',
    'Published',
    'Rejected',
    'Draft',
    'Trash', // trash is the same as Deleted.
    'Flagged'
];

// check if user can create a new comment
const canInsert = user => Users.canDo(user, "comments.new");

// check if user can edit a comment
const canEdit = Users.canEdit;

// check if user can edit *all* comments
const canEditAll = user => Users.canDo(user, "comments.edit.all");

/**
 * @summary Comments schema
 * @type {SimpleSchema}
 */
Comments.schema = new SimpleSchema({
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true
    },
    /**
     The `_id` of the parent comment, if there is one
     */
    parentCommentId: {
        type: String,
        // regEx: SimpleSchema.RegEx.Id,
        max: 500,
        insertableIf: canInsert,
        optional: true,
        publish: true,
        control: "none" // never show this
    },
    /**
     The `_id` of the top-level parent comment, if there is one
     */
    topLevelCommentId: {
        type: String,
        // regEx: SimpleSchema.RegEx.Id,
        max: 500,
        insertableIf: canInsert,
        optional: true,
        publish: true,
        control: "none" // never show this
    },
    /**
     The timestamp of comment creation
     */
    createdAt: {
        type: Date,
        optional: true,
        publish: false
    },
    /**
     The timestamp of the comment being posted. For now, comments are always created and posted at the same time
     */
    postedAt: {
        type: Date,
        optional: true,
        publish: true
    },
    /**
     The comment body (Markdown)
     */
    body: {
        type: String,
        max: 3000,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true,
        control: "textarea"
    },
    /**
     The HTML version of the comment body
     */
    htmlBody: {
        type: String,
        optional: true,
        publish: true
    },
    /**
     The comment author's name
     */
    author: {
        type: String,
        optional: true,
        publish: true
    },
    /**
     Whether the comment is inactive. Inactive comments' scores gets recalculated less often
     */
    inactive: {
        type: Boolean,
        optional: true,
        publish: true
    },
    /**
     The post's `_id`
     */
    postId: {
        type: String,
        optional: true,
        publish: true,
        // regEx: SimpleSchema.RegEx.Id,
        max: 500,
        form: {
            omit: true // never show this
        },
        join: {
            joinAs: "post",
            collection: () => Posts
        }
    },
    /**
     The comment author's `_id`
     */
    userId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "user",
            collection: () => Meteor.users
        }
    },
    /**
     Whether the comment is deleted. Delete comments' content doesn't appear on the site.
     */
    isDeleted: {
        type: Boolean,
        optional: true,
        publish: true
    },
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
                return Comments.getDefaultStatus(user);
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
    }
});

Comments.attachSchema(Comments.schema);

if (typeof Telescope.notifications !== "undefined") {
    Comments.addField({
        fieldName: 'disableNotifications',
        fieldSchema: {
            type: Boolean,
            optional: true,
            form: {
                omit: true
            }
        }
    });
}
