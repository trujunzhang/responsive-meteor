import Telescope from 'meteor/nova:lib';
// import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';
import {Counts} from 'meteor/tmeasday:publish-counts';
import Posts from '../collection.js';
import Topics from "meteor/nova:topics";
import Mimages from "meteor/nova:mimages";

Posts._ensureIndex({"status": 1, "postedAt": 1});

//ServerTransform.enableLogging();

// ------------------------------------- Helpers -------------------------------- //

/**
 * @summary Get all users relevant to a list of posts
 * (authors of the listed posts, and first four commenters of each post)
 * @param {Object} posts
 */
const getPostsListUsers = posts => {

    // add the userIds of each post authors
    let userIds = _.pluck(posts.fetch(), 'userId');

    // for each post, also add first four commenter's userIds to userIds array
    posts.forEach(function (post) {
        userIds = userIds.concat(_.first(post.commenters, 4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.publishedFields.list});
};

const getUserListMimages = users => {

    const coverIdsArray = [];
    _.forEach(users.fetch(), function (user) {
        coverIdsArray.push(user.telescope.coverId);
    });

    let coverIds = _.flatten(coverIdsArray);
    coverIds = _.unique(coverIds);

    return Mimages.find({_id: {$in: coverIds}});
};
const getPostListTopics = posts => {

    // add the folderIds of each post authors
    const topicIdsArray = _.pluck(posts.fetch(), 'topics');

    let topicIds = _.flatten(topicIdsArray);
    topicIds = _.unique(topicIds);

    return Topics.find({_id: {$in: topicIds}}, {fields: Topics.publishedFields.list});
};

/**
 * @summary Get all users relevant to a single post
 * (author of the current post, authors of its comments, and upvoters & downvoters of the post)
 * @param {Object} post
 */
const getSinglePostUsers = post => {

    let users = [post.userId]; // publish post author's ID

    /*
     NOTE: to avoid circular dependencies between nova:posts and nova:comments,
     use callback hook to get comment authors
     */
    users = Telescope.callbacks.run("posts.single.getUsers", users, post);

    // add upvoters
    if (post.upvoters && post.upvoters.length) {
        users = users.concat(post.upvoters);
    }

    // add downvoters
    if (post.downvoters && post.downvoters.length) {
        users = users.concat(post.downvoters);
    }

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.publishedFields.list});
};

const getSinglePostTopic = post => {
    const topicIds = post.topics;

    return Topics.find({_id: {$in: topicIds}}, {fields: Topics.publishedFields.list});
};

// ------------------------------------- Publications -------------------------------- //

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('posts.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    //this.autorun(function () {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Posts.parameters.get(terms);

    Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});

    options.fields = Posts.publishedFields.list;

    const posts = Posts.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, posts.count(), this.connection.id);

    const users = Tracker.nonreactive(function () {
        return getPostsListUsers(posts);
    });
    const topics = Tracker.nonreactive(function () {
        return getPostListTopics(posts);
    });

    return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];

    //});

});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('posts.detail.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    this.autorun(function () {

        const currentUser = this.userId && Meteor.users.findOne(this.userId);

        terms.currentUserId = this.userId; // add currentUserId to terms
        const {selector, options} = Posts.parameters.get(terms);

        Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});

        const posts = Posts.find(selector, options);

        // note: doesn't work yet :(
        // CursorCounts.set(terms, posts.count(), this.connection.id);

        const users = Tracker.nonreactive(function () {
            return getPostsListUsers(posts);
        });
        const topics = Tracker.nonreactive(function () {
            return getPostListTopics(posts);
        });

        return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];

    });

});

Meteor.publish('users.profile', function (terms) {

    let idOrSlug = terms._id || terms['telescope.slug'];
    let findById = Users.findOne(idOrSlug);
    let findBySlug = Users.findOne({"telescope.slug": idOrSlug});
    let user = typeof findById !== 'undefined' ? findById : findBySlug;
    let options = Users.isAdmin(this.userId) ? {} : {fields: Users.publishedFields.public};
    return user ? Users.find({_id: user._id}, options) : [];
});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('user.posts.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    this.autorun(function () {

        const currentUser = this.userId && Meteor.users.findOne(this.userId);

        terms['postsType'] = "user.posts";
        terms.currentUserId = this.userId; // add currentUserId to terms
        const {selector, options} = Posts.parameters.get(terms);

        Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});

        options.fields = Posts.publishedFields.list;

        const posts = Posts.find(selector, options);

        // note: doesn't work yet :(
        // CursorCounts.set(terms, posts.count(), this.connection.id);

        const users = Tracker.nonreactive(function () {
            return getPostsListUsers(posts);
        });
        const topics = Tracker.nonreactive(function () {
            return getPostListTopics(posts);
        });

        return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];
    });

});

/**
 * @summary Publish a single post, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('posts.single', function (terms) {

    check(terms, Match.OneOf({_id: String}, {_id: String, slug: Match.Any}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Posts.publishedFields.single};
    const posts = Posts.find(terms._id, options);
    const post = posts.fetch()[0];

    if (post) {
        const users = getSinglePostUsers(post);
        const topics = getSinglePostTopic(post);
        return Users.canView(currentUser, post) ? [posts, users, topics] : [Posts.find({status: Posts.config.STATUS_UI_ALERT})];
    } else {
        console.log(`// posts.single: no post found for _id “${terms._id}”`); // eslint-disable-line
        return [];
    }

});

Meteor.publish('posts.single.comment', function (terms) {

    check(terms, Match.OneOf({_id: String}, {_id: String, slug: Match.Any}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Posts.publishedFields.single};
    const posts = Posts.find(terms._id, options);
    const post = posts.fetch()[0];

    if (post) {
        return [posts];
    } else {
        console.log(`// posts.single: no post found for _id “${terms._id}”`); // eslint-disable-line
        return [];
    }

});

Meteor.publishTransformed('posts.single.with.related.list', function (terms) {

    check(terms, Match.OneOf({_id: String}, {_id: String, limit: Number}, {_id: String, slug: Match.Any, limit: Number}));

    const currentUser = this.userId && Meteor.users.findOne(this.userId);
    const options = {fields: Posts.publishedFields.single};
    const posts = Posts.find(terms._id, options);
    const post = posts.fetch()[0];

    if (post) {
        const users = getSinglePostUsers(post);
        const topics = getSinglePostTopic(post);
        return Users.canView(currentUser, post) ?
          [posts.serverTransform(function (doc) {
              doc.relatedIds = Posts.getRelatedLists(doc, terms.limit);
              return doc;
          }), users, topics] :
          [Posts.find({status: Posts.config.STATUS_UI_ALERT}).serverTransform(function (doc) {
              doc.relatedIds = [];
              doc._id = terms._id;
              return doc;
          })];
    } else {
        console.log(`// posts.single: no post found for _id “${terms._id}”`); // eslint-disable-line
        return [];
    }

});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('posts.related.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    //this.autorun(function () {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Posts.parameters.get(terms);

    //selector["_id"] = {$nin: [terms.postId]};
    //selector["author"] = {$nin: [terms.author]};

    Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});

    options.fields = Posts.publishedFields.list;

    const posts = Posts.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, posts.count(), this.connection.id);

    const users = Tracker.nonreactive(function () {
        return getPostsListUsers(posts);
    });

    const topics = Tracker.nonreactive(function () {
        return getPostListTopics(posts);
    });

    return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];

    //});

});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('app.posts.admin', function (terms) {

    //this.autorun(function () {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Posts.parameters.get(terms);

    Counts.publish(this, 'allCount', Posts.find({"status": {$in: Posts.config.PUBLISH_STATUS}}), {noReady: true});
    Counts.publish(this, 'publishCount', Posts.find({"status": Posts.config.STATUS_APPROVED}), {noReady: true});
    Counts.publish(this, 'pendingCount', Posts.find({"status": Posts.config.STATUS_PENDING}), {noReady: true});
    Counts.publish(this, 'rejectedCount', Posts.find({"status": Posts.config.STATUS_REJECTED}), {noReady: true});
    Counts.publish(this, 'draftCount', Posts.find({"status": Posts.config.STATUS_SPAM}), {noReady: true});
    Counts.publish(this, 'trashCount', Posts.find({"status": Posts.config.STATUS_DELETED}), {noReady: true});

    Counts.publish(this, 'tableCount', Posts.find(selector, options), {noReady: true});

    options.fields = Posts.publishedFields.list;

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const posts = Posts.find(selector, options);

    // note: doesn't work yet :(
    // CursorCounts.set(terms, posts.count(), this.connection.id);

    const users = Tracker.nonreactive(function () {
        return getPostsListUsers(posts);
    });
    const topics = Tracker.nonreactive(function () {
        return getPostListTopics(posts);
    });

    return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];

    //});

    //return [];
});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('admin.app.statistic', function (terms) {

    Counts.publish(this, 'postsCount', Posts.find({status: {$nin: [Posts.config.STATUS_REMOVED, Posts.config.STATUS_UI_ALERT]}}), {noReady: true});
    Counts.publish(this, 'usersCount', Users.find(), {noReady: true});
    Counts.publish(this, 'commentsCount', Comments.find(), {noReady: true});

    return [];
});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
//Meteor.publish('posts.admin', function (terms) {
//
//    // this.unblock(); // causes bug where publication returns 0 results
//
//    this.autorun(function () {
//
//        const currentUser = this.userId && Meteor.users.findOne(this.userId);
//
//        terms.currentUserId = this.userId; // add currentUserId to terms
//        const {selector, options} = Posts.parameters.get(terms);
//
//        Counts.publish(this, terms.listId, Posts.find(selector, options), {noReady: true});
//
//        options.fields = Posts.publishedFields.list;
//
//        const posts = Posts.find(selector, options);
//
//        // note: doesn't work yet :(
//        // CursorCounts.set(terms, posts.count(), this.connection.id);
//
//        const users = Tracker.nonreactive(function () {
//            return getPostsListUsers(posts);
//        });
//
//        const topics = Tracker.nonreactive(function () {
//            return getPostListTopics(posts);
//        });
//
//        return Users.canDo(currentUser, "posts.view.approved.all") ? [posts, users, topics] : [];
//
//    });
//
//});

Meteor.publish('admin.topics.list', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = Topics.parameters.get(terms));

    options.sort = {'statistic.postCount': -1};

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    Counts.publish(this, 'allCount', Topics.find({"status": {$in: Topics.config.PUBLISH_STATUS}}), {noReady: true});
    Counts.publish(this, 'publishCount', Topics.find({status: Topics.config.STATUS_APPROVED, is_ignore: false}), {noReady: true});
    Counts.publish(this, 'trashCount', Topics.find({status: Topics.config.STATUS_DELETED}), {noReady: true});
    Counts.publish(this, 'filterCount', Topics.find({is_ignore: true}), {noReady: true});

    //Counts.publish(this, 'tablePostCount', Topics.find(selector, options), {noReady: true});

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const topics = Topics.find(selector, options);
    let publication = this;

    topics.forEach(function (topic) {
        let topicIds = [topic._id];
        let cursor = Posts.find({$and: [{topics: {$in: topicIds}}]});
        Counts.publish(publication, topic.getCounterName(), cursor, {noReady: true});
    });

    return Users.canDo(currentUser, "admin.topics.view.all") ? [topics] : [];
});

Meteor.publish('app.users.admin', function (terms) {
    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    const {selector, options} =Users.parameters.get(terms);

    Counts.publish(this, 'tablePostCount', Users.find(selector, options), {noReady: true});

    Counts.publish(this, 'adminCount', Users.find({"isAdmin": true}), {noReady: true});
    Counts.publish(this, 'twitterCount', Users.find({"loginType": Users.config.TYPE_TWITTER}), {noReady: true});
    Counts.publish(this, 'facebookCount', Users.find({"loginType": Users.config.TYPE_FACEBOOK}), {noReady: true});
    Counts.publish(this, 'passwordlessCount', Users.find({"loginType": Users.config.TYPE_PASSWORDLESS}), {noReady: true});

    options.fields = Users.publishedFields.list;

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const users = Users.find(selector, options);

    let publication = this;

    users.forEach(function (user) {
        let userIds = [user._id];
        let cursor = Posts.find({userId: {$in: userIds}});
        Counts.publish(publication, user.getCounterName(), cursor, {noReady: true});
    });

    return Users.canDo(currentUser, "users.view.approved.all") ? [users] : [];
});
