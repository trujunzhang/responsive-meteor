import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import {Messages} from 'meteor/nova:core';

Comments.methods = {};

Comments.methods.checking = function (comment, lastComment) {
    const commentUser = Meteor.users.findOne(comment.userId);
    if (!!commentUser && !commentUser.isAdmin) {
        if (Comments.isApproved(comment) && !Comments.isApproved(lastComment)) {
            Telescope.callbacks.runAsync("comments.approve.async", comment, lastComment);
        }
    }
};

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Comment ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Comments.methods.new = function (comment) {

    const currentUser = Meteor.users.findOne(comment.userId);

    comment = Telescope.callbacks.run("comments.new.sync", comment, currentUser);

    comment._id = Comments.insert(comment);

    // note: query for comment to get fresh document with collection-hooks effects applied
    Telescope.callbacks.runAsync("comments.new.async", Comments.findOne(comment._id));

    return comment;
};

Comments.methods.edit = function (commentId, modifier, comment) {

    if (typeof comment === "undefined") {
        comment = Comments.findOne(commentId);
    }

    modifier = Telescope.callbacks.run("comments.edit.sync", modifier, comment);

    Comments.update(commentId, modifier);

    Telescope.callbacks.runAsync("comments.edit.async", Comments.findOne(commentId), comment);

    return Comments.findOne(commentId);
};

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Meteor.methods({

    /**
     * @summary Meteor method for submitting a comment from the client
     * Required properties: postId, body
     * @memberof Comments
     * @isMethod true
     * @param {Object} comment - the comment being inserted
     */
    'comments.new': function (comment) {

        Comments.simpleSchema().namedContext("comments.new").validate(comment);

        comment = Telescope.callbacks.run("comments.new.method", comment, Meteor.user());

        if (Meteor.isServer && this.connection) {
            comment.userIP = this.connection.clientAddress;
            comment.userAgent = this.connection.httpHeaders["user-agent"];
        }

        return Comments.methods.new(comment);
    },

    /**
     * @summary Meteor method for editing a comment from the client
     * @memberof Comments
     * @isMethod true
     * @param {Object} commentId - the id of the comment being updated
     * @param {Object} modifier - the update modifier
     */
    'comments.edit': function (commentId, modifier) {

        Comments.simpleSchema().namedContext("comments.edit").validate(modifier, {modifier: true});
        check(commentId, String);

        const comment = Comments.findOne(commentId);

        modifier = Telescope.callbacks.run("comments.edit.method", modifier, comment, Meteor.user());

        return Comments.methods.edit(commentId, modifier, comment);
    },

    /**
     * @summary Meteor method for deleting a comment
     * @memberof Comments
     * @isMethod true
     * @param {String} commentId - the id of the comment
     */
    'comments.deleteById': function (commentId) {

        check(commentId, String);

        let comment = Comments.findOne(commentId);
        let user = Meteor.user();

        if (Users.canEdit(user, comment)) {

            // decrement post comment count and remove user ID from post
            Posts.update(comment.postId, {
                $inc: {commentCount: -1},
                $pull: {commenters: comment.userId}
            });

            // decrement user comment count and remove comment ID from user
            Meteor.users.update({_id: comment.userId}, {
                $inc: {'telescope.commentCount': -1}
            });

            // note: should we also decrease user's comment karma ?
            // We don't actually delete the comment to avoid losing all child comments.
            // Instead, we give it a special flag
            Comments.update({_id: commentId}, {
                $set: {
                    body: 'Deleted',
                    htmlBody: 'Deleted',
                    isDeleted: true
                }
            });

        } else {

            Messages.flash("You don't have permission to delete this comment.", "error");

        }
    },

    /**
     * @summary Upvote a comment
     * @memberof Comments
     * @isMethod true
     * @param {String} commentId - the id of the comment
     */
    'comments.upvote': function (commentId) {
        check(commentId, String);
        return Telescope.operateOnItem.call(this, Comments, commentId, Meteor.user(), "upvote");
    },

    /**
     * @summary Downvote a comment
     * @memberof Comments
     * @isMethod true
     * @param {String} commentId - the id of the comment
     */
    'comments.downvote': function (commentId) {
        check(commentId, String);
        return Telescope.operateOnItem.call(this, Comments, commentId, Meteor.user(), "downvote");
    },

    /**
     * @summary Cancel an upvote on a comment
     * @memberof Comments
     * @isMethod true
     * @param {String} commentId - the id of the comment
     */
    'comments.cancelUpvote': function (commentId) {
        check(commentId, String);
        return Telescope.operateOnItem.call(this, Comments, commentId, Meteor.user(), "cancelUpvote");
    },

    /**
     * @summary Cancel a downvote on a comment
     * @memberof Comments
     * @isMethod true
     * @param {String} commentId - the id of the comment
     */
    'comments.cancelDownvote': function (commentId) {
        check(commentId, String);
        return Telescope.operateOnItem.call(this, Comments, commentId, Meteor.user(), "cancelDownvote");
    },

    'admin.comments.parentComment.username': function (commentId) {
        check(commentId, String);

        const comment = Comments.findOne(commentId);
        return !!comment ? Users.findOne(comment.author) : null;
    },

    'comments.approving.status': function (commentId, status) {

        check(commentId, String);

        const comment = Comments.findOne(commentId);
        const now = new Date();

        if (Users.canDo(Meteor.user(), "comments.new.approved")) {
            const currentStatus = comment.status;
            let set = {
                status: status
            };
            if (currentStatus !== Comments.config.STATUS_DELETED) {
                set = {
                    status: status,
                    lastStatus: currentStatus
                };
            }

            if (!comment.postedAt) {
                set.postedAt = now;
            }

            Comments.update(comment._id, {$set: set});

            // Checking whether the comment have been approved.
            Comments.methods.checking(Comments.findOne(comment._id), comment);
        } else {
            Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    /**
     * @summary Meteor method for moving comments to trash
     * @memberof Posts
     * @isMethod true
     * @param {String} commentsIds - the id of the comment to reject
     */
    'comments.move.to.trash': function (commentsIds) {

        check(commentsIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _comments = [];
            Comments.find({_id: {$in: commentsIds}}).forEach(function (comment) {
                _comments.push(comment);
                let lastStatus = comment.status;
                Comments.update(comment._id, {
                    $set: {
                        status: Comments.config.STATUS_DELETED,
                        lastStatus: lastStatus
                    }
                });
            });

            Telescope.callbacks.runAsync("comments.move.to.trash.async", _comments);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'comments.single.edit': function (commentIds, modifier) {

        check(commentIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _comments = [];
            Comments.find({_id: {$in: commentIds}}).forEach(function (comment) {
                _comments.push(comment);
                if (modifier.status !== -1) {
                    update['status'] = modifier.status;
                    update['lastStatus'] = comment.status;
                }
                //update['title'] = modifier.title;
                //update['slug'] = modifier.slug;
                //update['postedAt'] = modifier.postedAt;
                Comments.update(comment._id, {$set: update});

                // Checking whether the comment have been approved.
                Comments.methods.checking(Comments.findOne(comment._id), comment);
            });

            Telescope.callbacks.runAsync("comments.bulk.edit.async", _comments);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    'comments.restore.to.last.status': function (commentIds) {
        check(commentIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _comments = [];
            Comments.find({_id: {$in: commentIds}}).forEach(function (comment) {
                _comments.push(comment);
                let lastStatus = comment.lastStatus;
                Comments.update(comment._id, {$set: {status: lastStatus}});
            });

            Telescope.callbacks.runAsync("comments.restore.to.last.status.async", _comments);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

    /**
     * @summary Meteor method for deleting a post
     * @memberof Posts
     * @isMethod true
     * @param {String} commentIds - the id of the post
     */
    'comments.delete.permanently': function (commentIds) {

        check(commentIds, Array);

        const deletedCommentIds = [];
        Comments.find({_id: {$in: commentIds}}).forEach(function (comment) {

            // decrement post comment count and remove user ID from post
            Posts.update(comment.postId, {
                $inc: {commentCount: -1},
                $pull: {commenters: comment.userId}
            });

            // decrement user comment count and remove comment ID from user
            Meteor.users.update({_id: comment.userId}, {
                $inc: {'telescope.commentCount': -1}
            });

            // note: should we also decrease user's comment karma ?
            // We don't actually delete the comment to avoid losing all child comments.
            // Instead, we give it a special flag
            Comments.update({_id: comment._id}, {
                $set: {
                    body: 'Deleted',
                    htmlBody: 'Deleted',
                    isDeleted: true,
                    status: Comments.config.STATUS_REMOVED
                }
            });
        });

        Telescope.callbacks.runAsync("comments.delete.permanently.async", deletedCommentIds);

    },

});
