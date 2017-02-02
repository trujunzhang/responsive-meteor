import Telescope from 'meteor/nova:lib';
import PoliticlCaches from './collection.js';
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';

/**
 * @summary PoliticlCaches config namespace
 * @type {Object}
 */
PoliticlCaches.config = {};

// check if user can create a new topic
const canInsert = user => Users.canDo(user, "topics.new");

// check if user can edit a topic
const canEdit = Users.canEdit;

// check if user can edit *all* topics
const canEditAll = user => Users.canDo(user, "topics.edit.all");

PoliticlCaches.config.STATUS_APPROVED = 1;
PoliticlCaches.config.STATUS_DELETED = 2;
PoliticlCaches.config.STATUS_FILTER = 3;

PoliticlCaches.config.PUBLISH_STATUS = [
    PoliticlCaches.config.STATUS_APPROVED,
    PoliticlCaches.config.STATUS_FILTER,
];

PoliticlCaches.config.STATUS_TITLES = [
    "",
    'Publish',
    'Trash', // trash is the same as Deleted.
    'Filter'
];

/**
 * @summary PoliticlCaches schema
 * @type {SimpleSchema}
 */
PoliticlCaches.schema = new SimpleSchema({
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
    created_at: {
        type: String,
        optional: true,
        publish: false
    },
    /**
     The topic body (Markdown)
     */
    thumbnail_url: {
        type: String,
        publish: true,
    },
    url_from: {
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

PoliticlCaches.attachSchema(PoliticlCaches.schema);


