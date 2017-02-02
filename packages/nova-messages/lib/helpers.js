import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import Posts from "meteor/nova:posts";
import Messages from "./collection.js";

Messages.helpers({getCollection: () => Messages});
Messages.helpers({getCollectionName: () => "messages"});

/**
 * @summary Get all of a message's children
 * @param {Object} row
 */
Messages.generateMessage = function (row) {
    const {messageUser, post, folder, message} = row;
    let href, action, status = '',
      avatarObj = Users.getAvatarObj(messageUser);

    let information = {};
    switch (row.type) {
        case Messages.config.TYPE_ARTICLE_APPROVED:
            return {
                render: (<span>Congratulations! The article "<em>{message}</em>" submitted by you has been approved.</span>),
                avatarObj: avatarObj,
                link: Posts.getArticleUrl(post, Posts.config.STATUS_APPROVED)
            };
            break;
        case Messages.config.TYPE_ARTICLE_REJECTED:
            return {
                render: (<span>The article you submitted "<em>{message}</em>" has been rejected.</span>),
                avatarObj: avatarObj
            };
            break;
        case Messages.config.TYPE_ARTICLE_REMOVED:
            return {
                render: (<span>The article you submitted "<em>{message}</em>" has been removed.</span>),
                avatarObj: avatarObj
            };
            break;
        case Messages.config.TYPE_FOLDER_CREATED:
            return {
                render: (<span>You've created a new Collection "<em>{folder.name}</em>".</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('folderitem', messageUser, folder)
            };
        case Messages.config.TYPE_ARTICLE_TO_FOLDER:
            return {
                render: (<span>The article "<em>{message}</em>" has been added to your collection "<em>{folder.name}</em>".</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('folderitem', messageUser, folder)
            };
            break;
        case Messages.config.TYPE_FOLDER_REMOVED:
            return {
                render: (<span>The collection "<em>{message}</em>" has been deleted.</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('collections', messageUser)
            };
        case Messages.config.TYPE_ARTICLE_SUBMITTED:
            return {
                render: (<span>You submitted the article "<em>{message}</em>" for approval.</span>),
                avatarObj: avatarObj
            };
        case Messages.config.TYPE_USER_EDIT:
            return {
                render: (<span>Your account details have been updated</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('profile', messageUser)
            };
        case Messages.config.TYPE_COMMENT_POSTED:
            return {
                render: (<span>You commented on the article "<em>{message}</em>".</span>),
                avatarObj: avatarObj,
                link: Posts.getArticleUrl(post, Posts.config.STATUS_APPROVED)
            };
            break;
        case Messages.config.TYPE_COMMENT_VOTE_UP:
            return {
                render: (<span>Your comment on the article "<em>{message}</em>" was voted up!</span>),
                avatarObj: avatarObj,
                link: Posts.getArticleUrl(post, Posts.config.STATUS_APPROVED)
            };
            break;
        case Messages.config.TYPE_COMMENT_VOTE_DOWN:
            return {
                render: (<span>Your comment on the article "<em>{message}</em>" was voted down!</span>),
                avatarObj: avatarObj,
                link: Posts.getArticleUrl(post, Posts.config.STATUS_APPROVED)
            };
            break;
        case Messages.config.TYPE_USER_EMAIL_CHANGED:
            return {
                render: (<span>Your email has been updated!</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('editing', messageUser)
            };

        case Messages.config.TYPE_USER_TWITTER_CONNECTED:
            return {
                render: (<span>Your Twitter account has been connected!</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('editing', messageUser)
            };
        case Messages.config.TYPE_USER_FACEBOOK_CONNECTED:
            return {
                render: (<span>Your Facebook account has been connected!</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('editing', messageUser)
            };
        case Messages.config.TYPE_USER_SIGN_UP:
            return {
                render: (<span>Welcome,Users.getDisplayname(messageUser)!</span>),
                avatarObj: avatarObj,
                link: Users.getLinkObject('editing', messageUser)
            };
            break;
        case Messages.config.TYPE_FLAGED_POST:
            break;
    }

    return null;
};
Messages.helpers({
    generateMessage: function () {
        return Messages.generateMessage(this);
    }
});

/**
 * @summary Get a message's URL
 * @param {Object} message
 * @param user
 */
Messages.haveView = function (message, user) {
    let readerIds = message.readerIds;
    if (!!readerIds) {
        return _.contains(readerIds, user._id);
    }
    return false;
};
Messages.helpers({
    haveView: function () {
        return Messages.haveView(this);
    }
});

/**
 * @summary Get a message's counter name
 * @param {Object} message
 */
Messages.getCounterName = function (message) {
    return message._id + "-messagesCount";
};
Messages.helpers({
    getCounterName: function () {
        return Messages.getCounterName(this);
    }
});

