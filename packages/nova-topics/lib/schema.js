import Telescope from 'meteor/nova:lib';
import Topics from './collection.js';
import Users from 'meteor/nova:users';

/**
 * @summary Topics config namespace
 * @type {Object}
 */
Topics.config = {};

// check if user can create a new topic
const canInsert = user => Users.canDo(user, "topics.new");

// check if user can edit a topic
const canEdit = Users.canEdit;

// check if user can edit *all* topics
const canEditAll = user => Users.canDo(user, "topics.edit.all");

Topics.config.STATUS_APPROVED = 1;
Topics.config.STATUS_DELETED = 2;
Topics.config.STATUS_FILTER = 3;

Topics.config.PUBLISH_STATUS = [
    Topics.config.STATUS_APPROVED,
    Topics.config.STATUS_FILTER,
];

Topics.config.STATUS_TITLES = [
    "",
    'Publish',
    'Trash', // trash is the same as Deleted.
    'Filter'
];

Telescope.schemas.statistic = new SimpleSchema({
    postCount: {
        type: Number,
        defaultValue: 1
    }
});

/**
 * @summary Topics schema
 * @type {SimpleSchema}
 */
Topics.schema = new SimpleSchema({
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
    createdAt: {
        type: Date,
        optional: true,
        publish: false
    },
    /**
     The topic body (Markdown)
     */
    name: {
        type: String,
        publish: true,
    },
    slug: {
        type: String,
        publish: true,
    },
    status: {
        type: Number,
        optional: true,
        publish: true,
        defaultValue: Topics.config.STATUS_APPROVED,
    },
    is_ignore: {
        type: Boolean,
        optional: true,
        publish: true,
        defaultValue: false,
    },
    /**
     * The tag that record the total count of the post's tags contains it.
     */
    statistic: {
        type: Telescope.schemas.statistic,
        optional: true,
        publish: true,
    },
});

Topics.attachSchema(Topics.schema);


