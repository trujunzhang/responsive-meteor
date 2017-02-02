import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import Events from 'meteor/nova:events';
import {Messages} from 'meteor/nova:core';
import PublicationsUtils from 'meteor/utilities:smart-publications';
import Posts from './collection.js';

let url = require('url'),
  http = require('http');
let gm = require('gm').subClass({imageMagick: true});

/**
 *
 * Post Methods
 *
 */

Posts.methods = {};

Posts.methods.checking = function (post, lastPost) {
    const postUser = Meteor.users.findOne(post.userId);
    if (!!postUser && !postUser.isAdmin) {
        if (Posts.isApproved(post) && !Posts.isApproved(lastPost)) {
            Telescope.callbacks.runAsync("posts.approve.async", post, lastPost);
        }
    }
};

/**
 * @summary Insert a post in the database (note: optional post properties not listed here)
 * @param {Object} post - the post being inserted
 * @param {string} post.userId - the id of the user the post belongs to
 * @param {string} post.title - the post's title
 */
Posts.methods.new = function (post) {

    const currentUser = Meteor.users.findOne(post.userId);
    const topicsArray = post.topicsArray;

    post = Telescope.callbacks.run("posts.new.sync", post, currentUser);

    //A: which status of the post submitted by user?
    //B: Pending
    //   Someone will check the content and approve it
    //   If the content is not good, it will be rejected
    post.status = Posts.config.STATUS_PENDING;

    post._id = Posts.insert(post);

    // note: query for post to get fresh document with collection-hooks effects applied
    const newPost = Posts.findOne(post._id);

    Telescope.callbacks.runAsync("posts.new.async", newPost, topicsArray);

    return post;
};

/**
 * @summary Edit a post in the database
 * @param {string} postId – the ID of the post being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} post - the current post object
 */
Posts.methods.edit = function (postId, modifier, post) {

    const topicsArray = modifier.$set.topicsArray;

    if (typeof post === "undefined") {
        post = Posts.findOne(postId);
    }

    const postUser = Meteor.users.findOne(post.userId);

    modifier = Telescope.callbacks.run("posts.edit.sync", modifier, post);

    Posts.update(postId, modifier);

    const newPost = Posts.findOne(postId);
    Telescope.callbacks.runAsync("posts.edit.async", newPost, post, topicsArray, postUser);

    // Checking whether the post have been approved.
    Posts.methods.checking(newPost, post);

    return Posts.findOne(postId);
};

/**
 * @summary Increase the number of clicks on a post
 * @param {string} postId – the ID of the post being edited
 * @param {string} ip – the IP of the current user
 */
Posts.methods.increaseClicks = (postId, ip) => {

    let clickEvent = {
        name: 'click',
        properties: {
            postId: postId,
            ip: ip
        }
    };

    // make sure this IP hasn't previously clicked on this post
    let existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});

    if (!existingClickEvent) {
        Events.log(clickEvent);
        Posts.update(postId, {$inc: {clickCount: 1}});
    }
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

let postViews = [];

Meteor.methods({

    /**
     * @summary Meteor method for submitting a post from the client
     * NOTE: the current user and the post author user might sometimes be two different users!
     * Required properties: title
     * @memberof Posts
     * @isMethod true
     * @param {Object} post - the post being inserted
     */
    'posts.new': function (post) {

        Posts.simpleSchema().namedContext("posts.new").validate(post);

        post = Telescope.callbacks.run("posts.new.method", post, Meteor.user());

        if (Meteor.isServer && this.connection) {
            post.userIP = this.connection.clientAddress;
            post.userAgent = this.connection.httpHeaders["user-agent"];
        }

        return Posts.methods.new(post);
    },

    'posts.cached.ids': function (terms) {
        const {selector, options} = Posts.parameters.get(terms);
        // 6. set limit
        options.limit = 35;

        options.fields = PublicationsUtils.arrayToFields(["_id"]);
        const posts = Posts.find(selector, options);

        let cachedPostIds = _.pluck(posts.fetch(), '_id');

        return cachedPostIds;
    },

    'validate.submitted.post.link': function (link) {

        if (link === "") {
            //your_link_is_empty
            //throw new Meteor.Error(704, {status: "empty", value: "your_link_is_empty"});
            return {status: "empty", message: "empty", value: "your_link_is_empty"};
        }

        const posts = Posts.find({url: link});
        const post = posts.fetch()[0];

        //"invalid"
        if (post) {
            if (post.status !== Posts.config.STATUS_APPROVED) {
                return {status: "invalid", message: "duplicate", value: post};
            } else {
                return {status: "duplicate", message: "duplicate", value: post};
            }
        } else {
            return {status: "validated", message: "", value: {url: link}};
        }
    },

    /**
     * @summary Meteor method for editing a post from the client
     * @memberof Posts
     * @isMethod true
     * @param {Object} postId - the id of the post being updated
     * @param {Object} modifier - the update modifier
     */
    'posts.edit': function (postId, modifier) {

        Posts.simpleSchema().namedContext("posts.edit").validate(modifier, {modifier: true});
        check(postId, String);

        const post = Posts.findOne(postId);

        modifier = Telescope.callbacks.run("posts.edit.method", modifier, post, Meteor.user());

        return Posts.methods.edit(postId, modifier, post);
    },

    'posts.approving.status': function (postId, status) {

        check(postId, String);

        const post = Posts.findOne(postId);
        const now = new Date();

        if (Users.canDo(Meteor.user(), "posts.status.approved")) {

            const set = {status: status};

            if (!post.postedAt) {
                set.postedAt = now;
            }

            Posts.update(post._id, {$set: set});

            // Checking whether the post have been approved.
            Posts.methods.checking(Posts.findOne(post._id), post);

        } else {
            Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    /**
     * @summary Meteor method for moving posts to trash
     * @memberof Posts
     * @isMethod true
     * @param {String} postIds - the id of the post to reject
     */
    'posts.move.to.trash': function (postIds) {

        check(postIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _posts = [];
            Posts.find({_id: {$in: postIds}}).forEach(function (post) {
                _posts.push(post);
                let lastStatus = post.status;
                Posts.update(post._id, {
                    $set: {
                        status: Posts.config.STATUS_DELETED,
                        lastStatus: lastStatus
                    }
                });
            });

            Telescope.callbacks.runAsync("posts.move.to.trash.async", _posts);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'posts.bulk.edit': function (postIds, modifier) {

        check(postIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _posts = [];
            Posts.find({_id: {$in: postIds}}).forEach(function (post) {
                _posts.push(post);
                let categories = _.unique(modifier.categories.concat(post.categories));
                let topics = _.unique(modifier.topics.concat(post.topics));

                let update = {categories: categories, topics: topics};
                if (modifier.status !== -1) {
                    update.status = modifier.status;
                    update['lastStatus'] = post.status;
                }
                Posts.update(post._id, {$set: update});

                // Checking whether the post have been approved.
                Posts.methods.checking(Posts.findOne(post._id), post);
            });

            Telescope.callbacks.runAsync("posts.bulk.edit.async", _posts);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'posts.single.edit': function (postIds, modifier) {

        check(postIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _posts = [];
            Posts.find({_id: {$in: postIds}}).forEach(function (post) {
                _posts.push(post);
                let update = {categories: modifier.categories, topics: modifier.topics};
                if (modifier.status !== -1) {
                    update['status'] = modifier.status;
                    update['lastStatus'] = post.status;
                }
                update['title'] = modifier.title;
                update['slug'] = modifier.slug;
                update['postedAt'] = modifier.postedAt;
                Posts.update(post._id, {$set: update});

                // Checking whether the post have been approved.
                Posts.methods.checking(Posts.findOne(post._id), post);
            });

            Telescope.callbacks.runAsync("posts.bulk.edit.async", _posts);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'posts.restore.to.last.status': function (postIds) {
        check(postIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _posts = [];
            Posts.find({_id: {$in: postIds}}).forEach(function (post) {
                _posts.push(post);
                let lastStatus = post.lastStatus;
                Posts.update(post._id, {$set: {status: lastStatus}});
            });

            Telescope.callbacks.runAsync("posts.restore.to.last.status.async", _posts);
        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    /**
     * @summary Meteor method for increasing the number of views on a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postId - the id of the post
     * @param sessionId
     */
    'posts.increaseViews': function (postId, sessionId) {

        check(postId, String);
        check(sessionId, Match.Any);

        // only let users increment a post's view counter once per session
        let view = {_id: postId, userId: this.userId, sessionId: sessionId};

        if (_.where(postViews, view).length === 0) {
            postViews.push(view);
            Posts.update(postId, {$inc: {viewCount: 1}});
        }
    },

    /**
     * @summary Meteor method for deleting a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postIds - the id of the post
     */
    'posts.delete.permanently': function (postIds) {

        check(postIds, Array);

        // remove post comments
        // if(!this.isSimulation) {
        //   Comments.remove({post: postId});
        // }
        // NOTE: actually, keep comments after all

        const deletedPosts = [];
        Posts.find({_id: {$in: postIds}}).forEach(function (post) {
            deletedPosts.push(post);

            let postId = post._id;

            // decrement post count
            const user = Users.findOne(post.userId);
            if(!!user.telescope && user.telescope.postCount>0){
                Users.update({_id: post.userId}, {$inc: {"telescope.postCount": -1}});
            }

            // delete post
            Posts.remove(postId);
        });

        _.forEach(deletedPosts, function (post) {
            Posts.insert({
                _id: post._id,
                status: Posts.config.STATUS_REMOVED
            });
        });

        Telescope.callbacks.runAsync("posts.delete.permanently.async", deletedPosts);

    },

    /**
     * @summary Check for other posts with the same URL
     * @memberof Posts
     * @isMethod true
     * @param {String} url - the URL to check
     */
    'posts.checkForDuplicates': function (url) {
        Posts.checkForSameUrl(url);
    },

    /**
     * @summary Upvote a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postId - the id of the post
     */
    'posts.upvote': function (postId) {
        check(postId, String);
        return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "upvote");
    },

    /**
     * @summary Downvote a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postId - the id of the post
     */
    'posts.downvote': function (postId) {
        check(postId, String);
        return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "downvote");
    },

    /**
     * @summary Cancel an upvote on a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postId - the id of the post
     */
    'posts.cancelUpvote': function (postId) {
        check(postId, String);
        return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "cancelUpvote");
    },

    /**
     * @summary Cancel a downvote on a post
     * @memberof Posts
     * @isMethod true
     * @param {String} postId - the id of the post
     */
    'posts.cancelDownvote': function (postId) {
        check(postId, String);
        return Telescope.operateOnItem.call(this, Posts, postId, Meteor.user(), "cancelDownvote");
    },

    'posts.download.image': function (thumbnailUrl, cb) {
        check(thumbnailUrl, String);

        let tmpFile = '/tmp/online.jpg';

        http.get(thumbnailUrl, function (resp) {
            gm(resp).stream(function (err, stdout, stderr) {
                if (err) {
                    //self.context.message.showMessage(this, "Error processing image", 'error');
                }
            })
              .setFormat('jpg')
              .write(tmpFile, function (err) {
                    if (err) {
                        //self.context.message.showMessage(this, "Error processing image", 'error');
                    } else {
                        return tmpFile;
                    }
                }
              );
        })
          .on('error', function (err) {
              console.error('Error fetching image', err);
          });

        //return {};
    }
});
