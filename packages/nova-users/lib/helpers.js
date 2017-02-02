import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from './collection.js';
import moment from 'moment';

Users.helpers({getCollection: () => Users});
Users.helpers({getCollectionName: () => "users"});

////////////////////
//  User Getters  //
////////////////////

/**
 * @summary Get a user
 * @param {String} userOrUserId
 */
Users.getUser = function (userOrUserId) {
    if (typeof userOrUserId === "undefined") {
        if (!Meteor.user()) {
            throw new Error();
        } else {
            return Meteor.user();
        }
    } else if (typeof userOrUserId === "string") {
        return Users.findOne(userOrUserId);
    } else {
        return userOrUserId;
    }
};

/**
 * @summary Get a user's username (unique, no special characters or spaces)
 * @param {Object} user
 */
Users.getUserName = function (user) {
    try {
        if (user.username)
            return user.username;
        if (user && user.services && user.services.twitter && user.services.twitter.screenName)
            return user.services.twitter.screenName;
        if (user && user.services && user.services.facebook && user.services.facebook.name)
            return user.services.facebook.name;
    }
    catch (error) {
        console.log(error); // eslint-disable-line
        return null;
    }
};

Users.getUserNameByService = function (user, svc) {
    try {
        if (user && user.services && user.services[svc]) {
            if (svc === 'twitter') {
                return user.services.twitter.screenName;
            } else if (svc === 'facebook') {
                return user.services.facebook.name;
            }
        }
    }
    catch (error) {
        console.log(error); // eslint-disable-line
        return null;
    }
};
Users.helpers({
    getUserName: function () {
        return Users.getUserName(this);
    },
    getUserNameByService: function () {
        return Users.getUserNameByService(this);
    }
});
Users.getUserNameById = function (userId) {
    return Users.getUserName(Users.findOne(userId));
};

/**
 * @summary Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getDisplayName = function (user) {
    if (typeof user === "undefined") {
        return "";
    } else {
        return (user.telescope && user.telescope.displayName) ? user.telescope.displayName : Users.getUserName(user);
    }
};
Users.helpers({
    getDisplayName: function () {
        return Users.getDisplayName(this);
    }
});
Users.getDisplayNameById = function (userId) {
    return Users.getDisplayName(Users.findOne(userId));
};

/**
 * @summary Get a user's profile URL
 * @param {Object} user (note: we only actually need either the _id or slug properties)
 * @param {Boolean} isAbsolute
 */
Users.getProfileUrl = function (user, isAbsolute) {
    if (typeof user === "undefined") {
        return "";
    }
    isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
    var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0, -1) : "";
    if (user.telescope && user.telescope.slug) {
        return `${prefix}/users/${user.telescope.slug}`;
    } else {
        return "";
    }
};
Users.helpers({
    getProfileUrl: function (isAbsolute) {
        return Users.getProfileUrl(this, isAbsolute);
    }
});

/**
 * @summary Get a user's account edit URL
 * @param {Object} user (note: we only actually need either the _id or slug properties)
 * @param {Boolean} isAbsolute
 */
Users.getEditUrl = function (user, isAbsolute) {
    return `${Users.getProfileUrl(user, isAbsolute)}/edit`;
};
Users.helpers({
    getEditUrl: function (isAbsolute) {
        return Users.getEditUrl(this, isAbsolute);
    }
});

/**
 * @summary Get a user's Twitter name
 * @param {Object} user
 */
Users.getTwitterName = function (user) {
    // return twitter name provided by user, or else the one used for twitter login
    if (typeof user !== "undefined") {
        if (Telescope.utils.checkNested(user, 'profile', 'twitter')) {
            return user.profile.twitter;
        } else if (Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')) {
            return user.services.twitter.screenName;
        }
    }
    return null;
};
Users.helpers({
    getTwitterName: function () {
        return Users.getTwitterName(this);
    }
});
Users.getTwitterNameById = function (userId) {
    return Users.getTwitterName(Users.findOne(userId));
};

Users.getFacebookLink = function (user) {
    // return facebook name provided by user, or else the one used for twitter login
    if (typeof user !== "undefined") {
        if (Telescope.utils.checkNested(user, 'profile', 'facebook')) {
            return user.profile.facebook;
        } else if (Telescope.utils.checkNested(user, 'services', 'facebook', 'link')) {
            return user.services.facebook.link;
        }
    }
    return null;
};
Users.helpers({
    getFacebookLink: function () {
        return Users.getFacebookLink(this);
    }
});

/**
 * @summary Get a user's GitHub name
 * @param {Object} user
 */
Users.getGitHubName = function (user) {
    // return twitter name provided by user, or else the one used for twitter login
    if (Telescope.utils.checkNested(user, 'profile', 'github')) {
        return user.profile.github;
    } else if (Telescope.utils.checkNested(user, 'services', 'github', 'screenName')) { // TODO: double-check this with GitHub login
        return user.services.github.screenName;
    }
    return null;
};
Users.helpers({
    getGitHubName: function () {
        return Users.getGitHubName(this);
    }
});
Users.getGitHubNameById = function (userId) {
    return Users.getGitHubName(Users.findOne(userId));
};

/**
 * @summary Get a user's email
 * @param {Object} user
 */
Users.getEmail = function (user) {
    // ignoring, if user is empty, or user is admin.
    if (!!user && user.telescope && user.telescope.email) {
        return user.telescope.email;
    } else {
        return null;
    }
};
Users.helpers({
    getEmail: function () {
        return Users.getEmail(this);
    }
});

Users.getUserEmail = function (user) {
    // ignoring, if user is empty.
    if (user == null) {
        return null;
    }
    if (user.telescope && user.telescope.email) {
        return user.telescope.email;
    } else {
        return null;
    }
};
Users.helpers({
    getUserEmail: function () {
        return Users.getUserEmail(this);
    }
});
Users.getEmailById = function (userId) {
    return Users.getEmail(Users.findOne(userId));
};

/**
 * @summary Get a user's email hash
 * @param {Object} user
 */
Users.getEmailHash = function (user) {
    return user.telescope.emailHash;
};
Users.helpers({
    getEmailHash: function () {
        return Users.getEmailHash(this);
    }
});
Users.getEmailHashById = function (userId) {
    return Users.getEmailHash(Users.findOne(userId));
};

/**
 * @summary Get a user setting
 * @param {Object} user
 * @param {String} settingName
 * @param {Object} defaultValue
 */
Users.getSetting = function (user, settingName, defaultValue) {
    user = user || Meteor.user();
    defaultValue = defaultValue || null;
    // all settings should be in the user.telescope namespace, so add "telescope." if needed
    settingName = settingName.slice(0, 10) === "telescope." ? settingName : "telescope." + settingName;

    if (user && user.telescope) {
        var settingValue = Users.getProperty(user, settingName);
        return typeof settingValue === 'undefined' ? defaultValue : settingValue;
    } else {
        return defaultValue;
    }
};
Users.helpers({
    getSetting: function (settingName, defaultValue) {
        return Users.getSetting(this, settingName, defaultValue);
    }
});

////////////////////
//  User Checks   //
////////////////////

/**
 * @summary Check if the user has completed their profile.
 * @param {Object} user
 */
Users.hasCompletedProfile = function (user) {
    return _.every(Users.getRequiredFields(), function (fieldName) {
        return !!Telescope.getNestedProperty(user, fieldName);
    });
};
Users.helpers({
    hasCompletedProfile: function () {
        return Users.hasCompletedProfile(this);
    }
});
Users.hasCompletedProfileById = function (userId) {
    return Users.hasCompletedProfile(Users.findOne(userId));
};

/**
 * @summary Check if a user has upvoted a document
 * @param {Object} user
 * @param {Object} document
 */
Users.hasUpvoted = function (user, document) {
    return user && _.include(document.upvoters, user._id);
};
Users.helpers({
    hasUpvoted: function (document) {
        return Users.hasUpvoted(this, document);
    }
});

/**
 * @summary Check if a user has downvoted a document
 * @param {Object} user
 * @param {Object} document
 */
Users.hasDownvoted = function (user, document) {
    return user && _.include(document.downvoters, user._id);
};
Users.helpers({
    hasDownvoted: function (document) {
        return Users.hasDownvoted(this, document);
    }
});

///////////////////
// Other Helpers //
///////////////////

Users.findLast = function (user, collection) {
    return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});
};

Users.timeSinceLast = function (user, collection) {
    var now = new Date().getTime();
    var last = this.findLast(user, collection);
    if (!last)
        return 999; // if this is the user's first post or comment ever, stop here
    return Math.abs(Math.floor((now - last.createdAt) / 1000));
};

Users.numberOfItemsInPast24Hours = function (user, collection) {
    var mNow = moment();
    var items = collection.find({
        userId: user._id,
        createdAt: {
            $gte: mNow.subtract(24, 'hours').toDate()
        }
    });
    return items.count();
};

Users.getProperty = function (object, property) {
    // recursive function to get nested properties
    var array = property.split('.');
    if (array.length > 1) {
        var parent = array.shift();
        // if our property is not at this level, call function again one level deeper if we can go deeper, else return undefined
        return (typeof object[parent] === "undefined") ? undefined : this.getProperty(object[parent], array.join('.'));
    } else {
        // else return property
        return object[array[0]];
    }
};

////////////////////
// More Helpers   //
////////////////////

// helpers that don't take a user as argument

/**
 * @summary @method Users.getRequiredFields
 * Get a list of all fields required for a profile to be complete.
 */
Users.getRequiredFields = function () {
    var schema = Users.simpleSchema()._schema;
    var fields = _.filter(_.keys(schema), function (fieldName) {
        var field = schema[fieldName];
        return !!field.required;
    });
    return fields;
};

Users.adminUsers = function (options) {
    return this.find({isAdmin: true}, options).fetch();
};

Users.getCurrentUserEmail = function () {
    return Meteor.user() ? Users.getEmail(Meteor.user()) : '';
};

Users.findByEmail = function (email) {
    return Users.findOne({"telescope.email": email});
};

Users.getCounterName = function (post) {
    return post._id + "-postsCount";
}
Users.helpers({
    getCounterName: function () {
        return Users.getCounterName(this);
    }
});

Users.getCounterKeyName = function () {
    return "postsCount";
}
Users.helpers({
    getCounterKeyName: function () {
        return Users.getCounterKeyName(this);
    }
});

Users.getAvatarObj = function (user) {
    const url = Users.avatar.getUrl(user);
    if (!!url) {
        return {haveAvatar: true, url: url, avatarId: user._id, title: Users.getDisplayName(user), slug: user.telescope.slug};
    }
    return {haveAvatar: false, url: Users.avatar.getInitials(user), avatarId: user._id, title: Users.getDisplayName(user), slug: user.telescope.slug};
};
Users.helpers({
    getAvatarObj: function () {
        return Users.getAvatarObj(this);
    }
});

Users.getServiceInformation = function (user, service) {
    const hasCollected = Telescope.utils.checkNested(user, 'services', service);
    if (!hasCollected) {
        return null;
    }
    const url = Users.avatar.getUrlByService(user, service);
    if (!!url) {
        return {haveAvatar: true, url: url, title: Users.getUserNameByService(user, service)};
    }
    return {haveAvatar: false, url: Users.avatar.getInitials(user), title: Users.getUserNameByService(user, service)};
};
Users.helpers({
    getServiceInformation: function () {
        return Users.getServiceInformation(this);
    }
});

/**
 * @summary Get a user's display name (not unique, can take special characters and spaces)
 * @param {Object} user
 */
Users.getBio = function (user) {
    if (typeof user === "undefined") {
        return "";
    } else {
        // Issue #36: There should be no text on the cover image. Remove "Describe the Biography briefly".
        return (user.telescope && user.telescope.bio) ? user.telescope.bio : "";
    }
};
Users.helpers({
    getBio: function () {
        return Users.getBio(this);
    }
});
Users.getBioById = function (userId) {
    return Users.getBio(Meteor.users.findOne(userId));
};

/**
 * @summary Get a user's voted post count.
 * @param {Object} user
 */
Users.getVotedPostsCount = function (user) {
    if (typeof user === "undefined") {
        return "";
    } else {
        const upvotedPosts = user.telescope.upvotedPosts;
        const upvotedPostsCount = (upvotedPosts && upvotedPosts.length > 0) ? upvotedPosts.length : 0;
        const downVotedPosts = user.telescope.downvotedPosts;
        const downvotedPostsCount = (downVotedPosts && downVotedPosts.length > 0) ? downVotedPosts.length : 0;
        return upvotedPostsCount + downvotedPostsCount;
    }
};
Users.helpers({
    getVotedPostsCount: function () {
        return Users.getVotedPostsCount(this);
    }
});
Users.getVotedPostsCountById = function (userId) {
    return Users.getVotedPostsCount(Meteor.users.findOne(userId));
};

/**
 * @summary Get a user's collected folders (not unique, can empty)
 * @param {Object} user
 */
Users.getCollectedFolder = function (user) {
    if (typeof user === "undefined") {
        return "";
    } else {
        return (user.telescope && user.telescope.folders) ? user.telescope.folders : [];
    }
};
Users.helpers({
    getCollectedFolder: function () {
        return Users.getCollectedFolder(this);
    }
});
Users.getCollectedFolderById = function (userId) {
    return Users.getCollectedFolder(Meteor.users.findOne(userId));
};

Users.getMessagesLength = function (user) {
    if (!!user.telescope.messages) {
        return user.telescope.messages.length;
    }
    return 0;
};
Users.helpers({
    getMessagesLength: function () {
        return Users.getMessagesLength(this);
    }
});

/**
 * @summary Get a user's email
 * @param {Object} user
 */
Users.getRole = function (user) {
    if (user.isAdmin) {
        return "Administrator";
    } else {
        return "Role";
    }
};
Users.helpers({
    getRole: function () {
        return Users.getRole(this);
    }
});

Users.getLoginType = function (user) {
    const loginType = user.loginType;
    return Users.config.TYPE_TITLES[loginType];
};
Users.helpers({
    getLoginType: function () {
        return Users.getLoginType(this);
    }
});

Users.isLoggedUser = function (user, currentUser) {
    if (!!currentUser && user._id === currentUser._id) {
        return true;
    }

    return false;
};
Users.helpers({
    isLoggedUser: function () {
        return Users.isLoggedUser(this);
    }
});

/**
 * Check the post is for the backend admins.
 * @param location
 * @param user
 * @returns {boolean}
 */
Users.checkIsAdmin = function (location, user) {
    // Dashboard UI(for admin)
    let {admin} = location.query;
    if (!admin || !user) {
        return false;
    }
    else if (!!admin && user.isAdmin) {
        return true;
    }
    return false;
};

Users.openNewBackgroundTab = (element, url) => {
    var eventMatchers = {
          'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
          'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
      },
      defaultOptions = {
          pointerX: 0,
          pointerY: 0,
          button: 0,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          bubbles: true,
          cancelable: true
      };

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }

        return destination;
    }

    /**
     * Trigger a HTMLEvent or MouseEvent
     * Credit: http://stackoverflow.com/a/6158050
     *
     * @private
     * @param  {HTMLElement} element     The target element
     * @param  {string}      eventName   Event type
     * @param  {object}      ...         [optional] event object
     * @return {HTMLElement}             The target element
     */
    function DOMTrigger(element, eventName) {
        var options = extend(defaultOptions, arguments[2] || {}),
          oEvent, eventType = null,
          d = document;

        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) {
                eventType = name;
                break;
            }
        }

        if (!eventType) {
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        }

        if (d.createEvent) {
            oEvent = d.createEvent(eventType);
            if (eventType === 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            }
            else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, d.defaultView,
                  options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                  options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, null);
            }
            oEvent = extend(oEvent, options);
            element.dispatchEvent(oEvent);
        }
        else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = d.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    }

    var a = document.createElement("a");
    a.href = url;
    //var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    //evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
    //                   true, false, false, false, 0, null);
    //a.dispatchEvent(evt);

    //DOMTrigger(a,'click');

    //var click = document.createEvent('MouseEvents');
    //click.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false,
    //false, false, 0, null);
    //a.dispatchEvent(click);

    window.open(url);
};

Users.getHtmlBodyClass = function (menu) {
    return (!!menu && (menu.type === "LoginUI" || menu.type === "UserDeleteConfirm") ? "no-scroll" : "");
};
Users.helpers({
    getHtmlBodyClass: function () {
        return Users.getHtmlBodyClass(this);
    },
    checkIsAdmin: function () {
        return Users.checkIsAdmin(this);
    },
    openNewBackgroundTab: function () {
        return Users.openNewBackgroundTab(this);
    }
});
Users.openNewWindow = function (pathname, query = {}) {
    let result = _.map(Object.getOwnPropertyNames(query), function (k) {
        return [k, query[k]].join('=');
    }).join('&');

    let root = __meteor_runtime_config__.ROOT_URL.replace(/\/+$/, '');
    let url = root + pathname + (result !== "" ? '?' + result : "");
    window.open(url);
};

Users.getLinkObject = function (type, user = null, folder = null) {
    const userLink = !!user ? `/users/${user.telescope.slug}` : null;
    switch (type) {
        case "homepage":
            return {pathname: "/"};
        case "editing":
            return {pathname: "users/my/edit"};
        case "profile":
            return {pathname: userLink};
        case "downvotes":
            return {pathname: `${userLink}/downvotes`};
        case "submittedPosts":
            return {pathname: `${userLink}/posts`};
        case "collections":
            return {pathname: `${userLink}/collections`};
        case "folderitem":
            return {pathname: `${userLink}/collections/${folder._id}/${folder.name}`};
    }
};
Users.checkIsHomepage = function (location) {
    if (location.pathname == '/') {
        if (Object.keys(location.query).length == 0) {
            return true;
        }
        if (Object.keys(location.query).length == 1 && !!location.query.admin) {
            return true;
        }
    }
    return false;
};
Users.renderWithSideBar = function (children) {
    return (
      <div className="constraintWidth_ZyYbM container_3aBgK">
          <div className="content_1jnXo">
              {children}
              <Telescope.components.AppSideBar/>
          </div>
      </div>
    );
};

Users.needDelayRefresh = function (location) {
    if (location.query.postId || location.pathname !== '/' || location.query.action) {
        return false;
    }
    return true;
};

Users.helpers({
    getLinkObject: function () {
        return Users.getLinkObject(this);
    },
    openNewWindow: function () {
        return Users.openNewWindow(this);
    },
    checkIsHomepage: function () {
        return Users.checkIsHomepage(this);
    },
    renderWithSideBar: function () {
        return Users.renderWithSideBar(this);
    },
    needDelayRefresh: function () {
        return Users.needDelayRefresh(this);
    }
});
