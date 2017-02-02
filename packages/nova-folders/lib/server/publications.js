import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Folders from "../collection.js";

/**
 * @summary Get all users relevant to a single folder
 * (author of the current folder, authors of its comments, and upvoters & downvoters of the folder)
 * @param {Object} folder
 */
const getSingleFolderUsers = folder => {

    let users = [folder.userId]; // publish folder author's ID

    /*
     NOTE: to avoid circular dependencies between nova:posts and nova:comments,
     use callback hook to get comment authors
     */
    users = Telescope.callbacks.run("folders.single.getUsers", users, folder);

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.publishedFields.list});
};

Meteor.publish('folders', function () {

    const currentUser = this.userId && Users.findOne(this.userId);

    //if (Users.canDo(currentUser, "folders.view.approved.all")) {
    //    var userId = currentUser._id;
    //
    //    var folders = Folders.find({userId: userId}, {fields: Folders.publishedFields.list});
    //    var publication = this;
    //
    //    return folders;
    //}
    return [];
});

/**
 * @summary Publish a list of folders, along with the users corresponding to these folders
 * @param {Object} terms
 */
Meteor.publish('folders.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    //this.autorun(function () {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Folders.parameters.get(terms);

    options.fields = Folders.publishedFields.list;

    const folders = Folders.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, folders.count(), this.connection.id);

    return Users.canDo(currentUser, "folders.view.approved.all") ? [folders] : [];
    //});

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('folders.single', function (terms) {

    check(terms, Match.OneOf({_id: String}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Folders.publishedFields.single};
    const folders = Folders.find({_id: terms._id}, options);
    const folder = folders.fetch()[0];

    if (folder) {
        const users = getSingleFolderUsers(folder);
        return [folders, users];
    } else {
        console.log(`// folders.single: no collection found for _id “${terms._id}”`);
        return [];
    }

});