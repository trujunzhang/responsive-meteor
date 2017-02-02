import Telescope from 'meteor/nova:lib';
import Flags from "./collection.js";
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';

/**
 * @summary Flags config namespace
 * @type {Object}
 */
Flags.config = {};

Flags.config.STATUS_SUBMITTED = 1;
Flags.config.STATUS_APPROVED = 2;
Flags.config.STATUS_DELETED = 3;

Flags.config.TYPE_POST = 1;
Flags.config.TYPE_COMMENT = 2;

const canInsert = user => Users.canDo(user, "flags.new");
const canEdit = user => Users.canDo(user, "flags.edit.all");

// flag schema
Flags.schema = new SimpleSchema({
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true
    },
    reason: {
        type: String,
        optional: true,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true,
        form: {
            rows: 3
        }
    },
    /**
     The flag's status. One of submitted (`1`), approved (`2`), or deleted (`3`)
     */
    status: {
        type: Number,
        publish: true,
        defaultValue: Flags.config.STATUS_SUBMITTED
    },
    /**
     The flag's type. One of post (`11`), comment (`12`)
     */
    type: {
        type: Number,
        publish: true
    },
    /**
     ID
     */
    postId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "post",
            collection: () => Posts
        }
    },
    /**
     The timestamp of flag creation
     */
    createdAt: {
        type: Date,
        optional: true,
        publish: false
    },
    /**
     The timestamp of the flag being posted. For now, flags are always created and posted at the same time
     */
    postedAt: {
        type: Date,
        optional: true,
        publish: true
    },
    /**
     * The submitted author's `_id`,
     * Who submitted the flags.
     */
    userId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "flager",
            collection: () => Meteor.users
        }
    },
    /**
     * The article who submitted.
     */
    authorId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "author",
            collection: () => Meteor.users
        }
    },
    /**
     Whether the flag is deleted. Delete flags' content doesn't appear on the site.
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
    }
});

// Meteor.startup(function(){
//   Flags.internationalize();
// });

Flags.attachSchema(Flags.schema);

