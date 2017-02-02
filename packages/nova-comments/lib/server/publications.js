import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Comments from '../collection.js';

Comments._ensureIndex({postId: 1});
Comments._ensureIndex({parentCommentId: 1});

/**
 * @summary Publish a list of comments, along with the posts and users corresponding to these comments
 * @param {Object} terms
 */
Meteor.publish('comments.list', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = Comments.parameters.get(terms));

    // commenting this because of FR-SSR issue
    // Counts.publish(this, 'comments.list', Comments.find(selector, options));

    options.fields = Comments.publishedFields.list;

    const comments = Comments.find(selector, options);
    const posts = Posts.find({_id: {$in: _.pluck(comments.fetch(), 'postId')}}, {fields: Posts.publishedFields.list});
    const users = Meteor.users.find({_id: {$in: _.pluck(comments.fetch(), 'userId')}}, {fields: Users.publishedFields.list});

    return Users.canDo(currentUser, "comments.view.all") ? [comments, posts, users] : [];

});

/**
 * @summary Publish a list of posts, along with the users corresponding to these posts
 * @param {Object} terms
 */
Meteor.publish('app.comments.admin', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    const {selector, options} = Comments.parameters.get(terms);

    Counts.publish(this, 'allCount', Comments.find(Comments.adjustQueryCount(selector, {$in: Comments.config.PUBLISH_STATUS})), {noReady: true});
    Counts.publish(this, 'pendingCount', Comments.find(Comments.adjustQueryCount(selector, Comments.config.STATUS_PENDING)), {noReady: true});
    Counts.publish(this, 'publishCount', Comments.find(Comments.adjustQueryCount(selector, Comments.config.STATUS_APPROVED)), {noReady: true});
    Counts.publish(this, 'spamCount', Comments.find(Comments.adjustQueryCount(selector, Comments.config.STATUS_SPAM)), {noReady: true});
    Counts.publish(this, 'trashCount', Comments.find(Comments.adjustQueryCount(selector, Comments.config.STATUS_DELETED)), {noReady: true});

    Counts.publish(this, 'tableCount', Comments.find(selector, options), {noReady: true});

    options.fields = Comments.publishedFields.list;

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const comments = Comments.find(selector, options);
    const posts = Posts.find({_id: {$in: _.pluck(comments.fetch(), 'postId')}}, {fields: Posts.publishedFields.list});
    const users = Meteor.users.find({_id: {$in: _.pluck(comments.fetch(), 'userId')}}, {fields: Users.publishedFields.list});

    let publication = this;
    comments.forEach(function (comment) {
        const postId = comment.postId;
        Counts.publish(publication, comment._id + "-approvedCount", Comments.find({postId: postId, status: Comments.config.STATUS_APPROVED}), {noReady: true});
        Counts.publish(publication, comment._id + "-unapprovedCount", Comments.find({postId: postId, status: Comments.config.STATUS_PENDING}), {noReady: true});
    });
    return Users.canDo(currentUser, "comments.view.all") ? [comments, posts, users] : [];
});
