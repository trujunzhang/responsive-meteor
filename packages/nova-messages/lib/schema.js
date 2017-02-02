import Telescope from 'meteor/nova:lib';
import Messages from "./collection.js";
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';
import Folders from 'meteor/nova:folders';

/**
 * @summary Messages config namespace
 * @type {Object}
 */
Messages.config = {};

Messages.config.STATUS_SUBMITTED = 1;
Messages.config.STATUS_APPROVED = 2;
Messages.config.STATUS_DELETED = 3;

// Flagged
Messages.config.TYPE_FLAGED_POST = 11;// "flaged post";
Messages.config.TYPE_FLAGED_COMMENT = 12;// "flaged comment";
// Article
Messages.config.TYPE_ARTICLE_SUBMITTED = 21;// "Article Submitted";
Messages.config.TYPE_ARTICLE_APPROVED = 22;// "Article Approved";
Messages.config.TYPE_ARTICLE_REJECTED = 23;// "Article Rejected";
Messages.config.TYPE_ARTICLE_REMOVED = 24;// "Article Removed";
Messages.config.TYPE_ARTICLE_TO_FOLDER = 25;// Article Saved in Collection
// Folder
Messages.config.TYPE_FOLDER_CREATED = 31;// Collection Created
Messages.config.TYPE_FOLDER_REMOVED = 32;// Collection Deleted
// Comment
Messages.config.TYPE_COMMENT_POSTED = 41;// You commented on the article "<Article Title>".
Messages.config.TYPE_COMMENT_VOTE_UP = 42;// Your comment on the article "Article Title" was voted up!
Messages.config.TYPE_COMMENT_VOTE_DOWN = 43;// Your comment on the article "Article Title" was voted down!
// User
Messages.config.TYPE_USER_SIGN_UP = 51;// "Post has been added to user's folder";
Messages.config.TYPE_USER_EDIT = 52;// Your account details have been update
Messages.config.TYPE_USER_EMAIL_CHANGED = 53;// Your email has been updated
Messages.config.TYPE_USER_TWITTER_CONNECTED = 54;// Your Twitter/Facebook account has been connected
Messages.config.TYPE_USER_FACEBOOK_CONNECTED = 55;// Your Twitter/Facebook account has been connected
// Newsletter
Messages.config.TYPE_NEWSLETTER_ADD_USER = 61;// Congratulations! You're subscribed to our weekly Newsletter
Messages.config.TYPE_NEWSLETTER_REMOVE_USER = 62;// Congratulations! You're not subscribed to our weekly Newsletter

const canInsert = user => Users.canDo(user, "messages.new");
const canEdit = user => Users.canDo(user, "messages.edit.all");

// schemas.models is the type of the messages.(like post,article approved)
Telescope.schemas.flag = new SimpleSchema({
    senderId: {// Flag creator
        type: String
    },
    authorId: {// Ids of the receivers of the flag
        type: String
    }
});

// message schema
Messages.schema = new SimpleSchema({
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true
    },
    message: {
        type: String,
        optional: true,
        defaultValue: '',
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true,
        form: {
            rows: 3
        }
    },
    /**
     The message's status. One of submitted (`1`), approved (`2`), or deleted (`3`)
     */
    status: {
        type: Number,
        publish: true,
        defaultValue: Messages.config.STATUS_SUBMITTED
    },
    type: {
        type: Number,
        publish: true
    },
    postId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "post",
            collection: () => Posts
        }
    },
    folderId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "folder",
            collection: () => Folders
        }
    },
    commentId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "comment",
            collection: () => Comments
        }
    },
    flag: {
        type: Telescope.schemas.flag,
        optional: true,
        publish: true
    },
    /**
     The timestamp of message creation
     */
    createdAt: {
        type: Date,
        optional: true,
        publish: false
    },
    /**
     The timestamp of the message being posted. For now, messages are always created and posted at the same time
     */
    postedAt: {
        type: Date,
        optional: true,
        publish: true
    },
    /**
     The refer author's `_id`
     */
    userId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "messageUser",
            collection: () => Meteor.users
        }
    },
    userIds: {
        type: [String],
        optional: true,
        publish: true,
        join: {
            joinAs: "users",
            collection: () => Meteor.users
        }
    },
    readerIds: {
        type: [String],
        optional: true,
        publish: true,
        defaultValue: []
    },
    /**
     Whether the message is deleted. Delete messages' content doesn't appear on the site.
     */
    isDeleted: {
        type: Boolean,
        optional: true,
        publish: true,
        defaultValue: false
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
    }
});

// Meteor.startup(function(){
//   Messages.internationalize();
// });

Messages.attachSchema(Messages.schema);

