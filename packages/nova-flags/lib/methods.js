import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';
import Flags from "./collection.js";
import {Messages} from 'meteor/nova:core';

/**
 *
 * Flag Methods
 *
 */

Flags.methods = {};
/**
 * @summary Insert a flag in the database (note: optional flag properties not listed here)
 * @param {Object} flag - the flag being inserted
 * @param {string} flag.userId - the id of the user the flag belongs to
 * @param {string} flag.title - the flag's title
 */
Flags.methods.new = function (flag) {

    const currentUser = Meteor.users.findOne(flag.userId);

    flag = Telescope.callbacks.run("flags.new.sync", flag, currentUser);

    flag._id = Flags.insert(flag);

    // note: query for flag to get fresh document with collection-hooks effects applied

    Telescope.callbacks.runAsync("flags.new.async", Flags.findOne(flag._id), currentUser);

    return flag;
};

/**
 * @summary Edit a flag in the database
 * @param {string} flagId – the ID of the flag being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} flag - the current flag object
 */
Flags.methods.edit = function (flagId, modifier, flag) {

    if (typeof flag === "undefined") {
        flag = Flags.findOne(flagId);
    }

    modifier = Telescope.callbacks.run("flags.edit.sync", modifier, flag);

    Flags.update(flagId, modifier);

    Telescope.callbacks.runAsync("flags.edit.async", Flags.findOne(flagId), flag);

    return Flags.findOne(flagId);
};

Meteor.methods({

    /**
     * @summary Meteor method for submitting a flag from the client
     * NOTE: the current user and the flag author user might sometimes be two different users!
     * Required properties: title
     * @memberof Flags
     * @isMethod true
     * @param {Object} flag - the flag being inserted
     */
    'flags.new': function (flag) {

        Flags.simpleSchema().namedContext("flags.new").validate(flag);

        flag = Telescope.callbacks.run("flags.new.method", flag, Meteor.user());

        if (Meteor.isServer && this.connection) {
            flag.userIP = this.connection.clientAddress;
            flag.userAgent = this.connection.httpHeaders["user-agent"];
        }

        return Flags.methods.new(flag);
    },

    /**
     * @summary Meteor method for deleting a post
     * @memberof Posts
     * @isMethod true
     * @param {String} flagId - the id of the post
     */
    'flags.remove': function (flagIds) {

        check(flagIds, Array);

        // remove flag comments
        // if(!this.isSimulation) {
        //   Comments.remove({flag: flagId});
        // }
        // NOTE: actually, keep comments after all

        const flags = [];
        _.forEach(flagIds,function(flagId){
            let flag = Flags.findOne({_id: flagId});
            flags.push(flag);

            // delete flag
            Flags.remove(flagId);
        });

        Telescope.callbacks.runAsync("flags.remove.async", flags);
    }

});
