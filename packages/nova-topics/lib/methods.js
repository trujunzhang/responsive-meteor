import Telescope from 'meteor/nova:lib';
import Topics from './collection.js';
import Users from 'meteor/nova:users';
import {Messages} from 'meteor/nova:core';
import escapeStringRegexp from 'escape-string-regexp';

Topics.methods = {};
// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Topic ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Topics.methods.new = function (topic) {

    const currentUser = Meteor.users.findOne(topic.userId);

    topic = Telescope.callbacks.run("topics.new.sync", topic, currentUser);

    topic._id = Topics.insert(topic);

    // note: query for topic to get fresh document with collection-hooks effects applied
    Telescope.callbacks.runAsync("topics.new.async", Topics.findOne(topic._id));

    return topic;
};

Topics.methods.edit = function (topicId, modifier, topic) {

    if (typeof topic === "undefined") {
        topic = Topics.findOne(topicId);
    }

    modifier = Telescope.callbacks.run("topics.edit.sync", modifier, topic);

    Topics.update(topicId, modifier);

    Telescope.callbacks.runAsync("topics.edit.async", Topics.findOne(topicId), topic);

    return Topics.findOne(topicId);
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Meteor.methods({

    /**
     * @summary Meteor method for submitting a topic from the client
     * Required properties: postId, body
     * @memberof Topics
     * @isMethod true
     * @param {Object} topic - the topic being inserted
     */
    'topics.new': function (topic) {

        Topics.simpleSchema().namedContext("topics.new").validate(topic);

        topic = Telescope.callbacks.run("topics.new.method", topic, Meteor.user());

        if (Meteor.isServer && this.connection) {
            topic.userIP = this.connection.clientAddress;
            topic.userAgent = this.connection.httpHeaders["user-agent"];
        }

        return Topics.methods.new(topic);
    },

    /**
     * @summary Meteor method for editing a topic from the client
     * @memberof Topics
     * @isMethod true
     * @param {Object} topicId - the id of the topic being updated
     * @param {Object} modifier - the update modifier
     */
    'topics.edit': function (topicId, modifier) {

        Topics.simpleSchema().namedContext("topics.edit").validate(modifier, {modifier: true});
        check(topicId, String);

        const topic = Topics.findOne(topicId);

        modifier = Telescope.callbacks.run("topics.edit.method", modifier, topic, Meteor.user());

        return Topics.methods.edit(topicId, modifier, topic);
    },

    'topics.move.to.trash': function (topicIds) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                Topics.update(topic._id, {$set: {status: Topics.config.STATUS_DELETED}});
            });

            Telescope.callbacks.runAsync("topicsMoveToTrashAsync", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },
    'topics.move.to.approved': function (topicIds) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                Topics.update(topic._id, {$set: {status: Topics.config.STATUS_APPROVED}});
            });

            Telescope.callbacks.runAsync("topicsMoveToApprovedAsync", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },
    'topics.move.to.published': function (topicIds) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                Topics.update(topic._id, {$set: {is_ignore: false}});
            });

            Telescope.callbacks.runAsync("topicsMoveToPublishedAsync", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },
    'topics.delete': function (topicIds) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                // delete topic
                Topics.remove(topic._id);
            });

            Telescope.callbacks.runAsync("topicsDeleteAsync", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'topics.bulk.edit': function (topicIds, modifier) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                let update = {};
                if (!!modifier.name && !!modifier.slug) {
                    update['name'] = modifier.name;
                    update['slug'] = modifier.slug;
                }
                Topics.update(topic._id, {$set: update});
            });

            Telescope.callbacks.runAsync("topics.bulk.edit.async", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'topics.filter.in.trending': function (topicIds) {

        check(topicIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _topics = [];
            Topics.find({_id: {$in: topicIds}}).forEach(function (topic) {
                _topics.push(topic);
                Topics.update(topic._id, {$set: {is_ignore: true}});
            });

            Telescope.callbacks.runAsync("topicsFilterInTrending", _topics);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'topics.search': function (input) {

        check(input, String);

        let parameters = {
            selector: {},
            options: {
                limit: 5,
                sort: {'statistic.postCount': -1}
            }
        };
        parameters = Telescope.utils.deepExtend(true, parameters, {
            selector: {
                $or: [
                    {name: {$regex: escapeStringRegexp(input), $options: 'i'}}
                ]
            }
        });
        return Topics.find(parameters.selector, parameters.options).fetch();
    },
});
