import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';
import Folders from 'meteor/nova:folders';
import Messages from "../collection.js";

const getMessageListPosts = messages => {

    // add the postIds of each post authors
    let postIds = _.pluck(messages.fetch(), 'postId');

    postIds = _.unique(postIds);

    return Posts.find({_id: {$in: postIds}}, {fields: Posts.publishedFields.list});
};

const getMessageListFolders = messages => {

    // add the folderIds of each post authors
    let folderIds = _.pluck(messages.fetch(), 'folderId');

    folderIds = _.unique(folderIds);

    return Folders.find({_id: {$in: folderIds}}, {fields: Folders.publishedFields.list});
};

Meteor.publish('messages', function () {

    //const currentUser = this.userId && Users.findOne(this.userId);

    //if (Users.canDo(currentUser, "messages.view.approved.all")) {
    //    var userId = currentUser._id;
    //
    //    var messages = Messages.find({userId: userId}, {fields: Messages.publishedFields.list});
    //    var publication = this;
    //
    //    return messages;
    //}
    return [];
});

/**
 * @summary Publish a list of messages, along with the users corresponding to these messages
 * @param {Object} terms
 */
Meteor.publish('messages.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    this.autorun(function () {

        const currentUser = this.userId && Meteor.users.findOne(this.userId);

        const {selector, options} = Messages.parameters.get(terms);

        options.fields = Messages.publishedFields.list;

        const messages = Messages.find(selector, options);

        const posts = Tracker.nonreactive(function () {
            return getMessageListPosts(messages);
        });
        const folders = Tracker.nonreactive(function () {
            return getMessageListFolders(messages);
        });

        return Users.canDo(currentUser, "messages.view.approved.all") ? [messages, posts, folders] : [];
    });

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('messages.single', function (terms) {

    check(terms, Match.OneOf({_id: String}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Messages.publishedFields.single};
    const messages = Messages.find({_id: terms._id}, options);
    const message = messages.fetch()[0];

    if (message) {
        return [messages];
    } else {
        console.log(`// messages.single: no collection found for _id “${terms._id}”`);
        return [];
    }

});
