import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Flags from "../collection.js";

Meteor.publish('flags', function () {

    //const currentUser = this.userId && Users.findOne(this.userId);

    //if (Users.canDo(currentUser, "flags.view.approved.all")) {
    //    var userId = currentUser._id;
    //
    //    var flags = Flags.find({userId: userId}, {fields: Flags.publishedFields.list});
    //    var publication = this;
    //
    //    return flags;
    //}
    return [];
});

/**
 * @summary Publish a list of flags, along with the users corresponding to these flags
 * @param {Object} terms
 */
Meteor.publish('flags.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    this.autorun(function () {

        const currentUser = this.userId && Meteor.users.findOne(this.userId);

        terms.currentUserId = this.userId; // add currentUserId to terms
        const {selector, options} = Flags.parameters.get(terms);

        options.fields = Flags.publishedFields.list;

        const flags = Flags.find(selector, options);

        // note: doesn't work yet :(
        // CursorCounts.set(terms, flags.count(), this.connection.id);

        return Users.canDo(currentUser, "flags.view.approved.all") ? [flags] : [];
    });

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('flags.single', function (terms) {

    check(terms, Match.OneOf({_id: String}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Flags.publishedFields.single};
    const flags = Flags.find({_id: terms._id}, options);
    const flag = flags.fetch()[0];

    if (flag) {
        return [flags];
    } else {
        console.log(`// flags.single: no collection found for _id “${terms._id}”`);
        return [];
    }

});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('app.flags.admin', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Flags.parameters.get(terms);


    Counts.publish(this, 'allCount', Flags.find(), {noReady: true});
    Counts.publish(this, 'tableCount', Flags.find(selector, options), {noReady: true});

    options.fields = Flags.publishedFields.list;

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const flags = Flags.find(selector, options);
    const posts = Posts.find({_id: {$in: _.pluck(flags.fetch(), 'postId')}}, {fields: Posts.publishedFields.list});

    let userIds = _.pluck(flags.fetch(), 'userId').concat(_.pluck(flags.fetch(), 'authorId'));
    const users = Meteor.users.find({_id: {$in: _.unique(userIds)}}, {fields: Users.publishedFields.list});

    return Users.canDo(currentUser, "flags.view.all") ? [flags, posts, users] : [];
});
