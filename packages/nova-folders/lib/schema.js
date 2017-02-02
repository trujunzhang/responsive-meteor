import Telescope from 'meteor/nova:lib';
import Folders from "./collection.js";
import Users from 'meteor/nova:users';

const canInsert = user => Users.canDo(user, "folders.new");
const canEdit = user => Users.canDo(user, "folders.edit.all");

// folder schema
Folders.schema = new SimpleSchema({
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true
    },
    name: {
        type: String,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true
    },
    description: {
        type: String,
        optional: true,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true,
        form: {
            rows: 3
        }
    },
    order: {
        type: Number,
        optional: true,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true
    },
    slug: {
        type: String,
        optional: true,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true
    },
    visible: {
        type: String,
        optional: true,
        insertableIf: canInsert,
        editableIf: canEdit,
        publish: true
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
        publish: true,
    },
    /**
     The comment author's `_id`
     */
    userId: {
        type: String,
        optional: true,
        publish: true,
        join: {
            joinAs: "folderUser",
            collection: () => Meteor.users
        }
    },
    /**
     Whether the comment is deleted. Delete comments' content doesn't appear on the site.
     */
    isDeleted: {
        type: Boolean,
        optional: true,
        publish: true,
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
    lastPost: {
        type: String,
        optional: true,
        publish: true,
        defaultValue:''
    },
    /**
     Groups
     */
    posts: {
        type: [String],
        optional: true,
        publish: true,
        defaultValue: []
    },
});

// Meteor.startup(function(){
//   Folders.internationalize();
// });

Folders.attachSchema(Folders.schema);

