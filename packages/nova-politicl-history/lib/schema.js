import Telescope from 'meteor/nova:lib';
import PoliticlHistory from './collection.js';
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';

/**
 * @summary PoliticlHistory config namespace
 * @type {Object}
 */
PoliticlHistory.config = {};

// check if user can create a new topic
const canInsert = user => Users.canDo(user, "topics.new");

// check if user can edit a topic
const canEdit = Users.canEdit;

// check if user can edit *all* topics
const canEditAll = user => Users.canDo(user, "topics.edit.all");

PoliticlHistory.config.STATUS_APPROVED = 1;
PoliticlHistory.config.STATUS_DELETED = 2;
PoliticlHistory.config.STATUS_FILTER = 3;

PoliticlHistory.config.PUBLISH_STATUS = [
    PoliticlHistory.config.STATUS_APPROVED,
    PoliticlHistory.config.STATUS_FILTER,
];

PoliticlHistory.config.STATUS_TITLES = [
    "",
    'Publish',
    'Trash', // trash is the same as Deleted.
    'Filter'
];

/**
 * @summary PoliticlHistory schema
 * @type {SimpleSchema}
 */
PoliticlHistory.schema = new SimpleSchema({
    /**
     ID
     */
    _id: {
        type: String,
        optional: true,
        publish: true,
    },
    /**
     The timestamp of topic creation
     */
    url: {
        type: String,
        optional: true,
        publish: false
    },
    /**
     The topic body (Markdown)
     */
    created_at: {
        type: String,
        publish: true,
    },
    post_id: {
        type: String,
        publish: true,
        join: {
            joinAs: "post",
            collection: () => Posts
        }
    }
});

PoliticlHistory.attachSchema(PoliticlHistory.schema);


