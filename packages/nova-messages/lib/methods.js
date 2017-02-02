import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Messages from "./collection.js";

/**
 *
 * Message Methods
 *
 */

Messages.methods = {};
/**
 * @summary Insert a message in the database (note: optional message properties not listed here)
 * @param {Object} message - the message being inserted
 * @param {string} message.userId - the id of the user the message belongs to
 * @param {string} message.title - the message's title
 */
Messages.methods.new = function (message) {

    const currentUser = Meteor.users.findOne(message.userId);

    message = Telescope.callbacks.run("messages.new.sync", message, currentUser);

    message._id = Messages.insert(message);

    // note: query for message to get fresh document with collection-hooks effects applied
    Telescope.callbacks.runAsync("messages.new.async", Messages.findOne(message._id));

    return message;
};

/**
 * @summary Edit a message in the database
 * @param {string} messageId – the ID of the message being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} message - the current message object
 */
Messages.methods.edit = function (messageId, modifier, message) {

    if (typeof message === "undefined") {
        message = Messages.findOne(messageId);
    }

    modifier = Telescope.callbacks.run("messages.edit.sync", modifier, message);

    Messages.update(messageId, modifier);

    Telescope.callbacks.runAsync("messages.edit.async", Messages.findOne(messageId), message);

    return Messages.findOne(messageId);
};

var messageViews = [];

Meteor.methods({

    /**
     * @summary Meteor method for submitting a message from the client
     * NOTE: the current user and the message author user might sometimes be two different users!
     * Required properties: title
     * @memberof Messages
     * @isMethod true
     * @param {Object} message - the message being inserted
     */
    'messages.new': function (message) {

        Messages.simpleSchema().namedContext("messages.new").validate(message);

        message = Telescope.callbacks.run("messages.new.method", message, Meteor.user());

        if (Meteor.isServer && this.connection) {
            message.userIP = this.connection.clientAddress;
            message.userAgent = this.connection.httpHeaders["user-agent"];
        }

        return Messages.methods.new(message);
    },

    /**
     * @summary Meteor method for deleting a post
     * @memberof Posts
     * @isMethod true
     * @param {String} messageId - the id of the post
     */
    'messages.remove': function (messageId) {

        check(messageId, String);

        // remove message comments
        // if(!this.isSimulation) {
        //   Comments.remove({message: messageId});
        // }
        // NOTE: actually, keep comments after all

        let message = Messages.findOne({_id: messageId});

        // delete message
        Messages.remove(messageId);

        Telescope.callbacks.runAsync("messages.remove.async", message);

    },

    'messages.add.reader': function (messageId, userId) {

        check(messageId, String);
        check(userId, String);

        let user = Meteor.user();

        let message = Messages.findOne({_id: messageId});

        update = {
            $addToSet: {readerIds: user._id},
        };

        let result = Messages.update({_id: messageId}, update);

        if (result > 0) {
            Telescope.callbacks.runAsync("messages.add.reader.async", message, user);
            return true;
        }
    },

});

//Messages.smartMethods({
//  createName: "messages.new",
//  editName: "messages.edit"
//});