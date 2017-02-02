import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';

Comments.helpers({getCollection: () => Comments});
Comments.helpers({getCollectionName: () => "comments"});

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Get URL of a comment page.
 * @param {Object} comment
 * @param isAbsolute
 */
Comments.getPageUrl = function (comment, isAbsolute = false) {
    const post = Comments.findOne(comment.postId);
    return `${Comments.getPageUrl(post, isAbsolute)}/#${comment._id}`;
};
Comments.helpers({
    getPageUrl: function () {
        return Comments.getPageUrl(this);
    }
});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a comment author's name
 * @param {Object} comment
 */
Comments.getAuthorName = function (comment) {
    let user = Meteor.users.findOne(comment.userId);
    return user ? user.getDisplayName() : comment.author;
};
Comments.helpers({
    getAuthorName: function () {
        return Comments.getAuthorName(this);
    }
});

Comments.getCurrentChildrenCount = function (comment) {
    let size = 0;
    let children = comment.childrenResults;
    //while (children !== "undefined") {
    //
    //}

    return size;
};
Comments.helpers({
    getCurrentChildrenCount: function () {
        return Comments.getCurrentChildrenCount(this);
    }
});

Comments.adjustCurrentComment = function (comment, limit) {
    let user = Meteor.users.findOne(comment.userId);
    return user ? user.getDisplayName() : comment.author;
};
Comments.helpers({
    adjustCurrentComment: function () {
        return Comments.adjustCurrentComment(this);
    }
});

Comments.getLimitedComments = function (result, limit, showMore) {
    if (showMore == false) {
        return result;
    }
    if (limit > result.length) {
        return result;
    }
    let limitedResult = [];
    for (let i = 0; i < limit; i++) {
        limitedResult.push(result[i]);
    }
    return limitedResult;
};
Comments.helpers({
    getLimitedComments: function () {
        return Comments.getLimitedComments(this);
    }
});

/**
 * @summary Get default status for new posts.
 * @param {Object} user
 */
Comments.getDefaultStatus = function (user) {
    return Comments.config.STATUS_APPROVED;
};

/**
 * @summary Check if a comment is approved
 * @param {Object} comment
 */
Comments.isApproved = function (comment) {
    return comment.status === Comments.config.STATUS_APPROVED;
};
Comments.helpers({
    isApproved: function () {
        return Comments.isApproved(this);
    }
});

/**
 * @summary Check if a comment is pending
 * @param {Object} comment
 */
Comments.isPending = function (comment) {
    return comment.status === Comments.config.STATUS_PENDING;
};

Comments.adjustQueryCount = function (selector, status) {
    let newSelector = _.clone(selector);
    newSelector.status = status;
    return newSelector;
};
Comments.generateTrClass = function(trClass,query,comment){
    if(Comments.isPending(comment)){
        trClass = trClass + " unapproved";
    } else if(Comments.isApproved(comment)){
        trClass = trClass + " approved";
    }

    return trClass;
};
Comments.helpers({
    isPending: function () {
        return Comments.isPending(this);
    },
    adjustQueryCount: function () {
        return Comments.adjustQueryCount(this);
    },
    generateTrClass: function () {
        return Comments.generateTrClass(this);
    }
});
