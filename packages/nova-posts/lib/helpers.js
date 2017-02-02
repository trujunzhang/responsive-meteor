import Telescope from 'meteor/nova:lib';
import moment from 'moment';
import Posts from './collection.js';
import Users from 'meteor/nova:users';
import emojiStrip from 'emoji-strip';
import Topics from 'meteor/nova:topics';

import Mimages from "meteor/nova:mimages";

let md5 = require('blueimp-md5');
let parseDomain = require('parse-domain');

Posts.helpers({getCollection: () => Posts});
Posts.helpers({getCollectionName: () => "posts"});

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Return a post's link if it has one, else return its post page URL
 * @param {Object} post
 * @param isAbsolute
 * @param isRedirected
 * @param isAbsolute
 * @param isRedirected
 */
Posts.getLink = function (post, isAbsolute = false, isRedirected = true) {
    const url = isRedirected ? Telescope.utils.getOutgoingUrl(post.url) : post.url;
    return !!post.url ? url : this.getPageUrl(post, isAbsolute);
};
Posts.helpers({
    getLink: function (isAbsolute) {
        return Posts.getLink(this, isAbsolute);
    }
});

/**
 * @summary Depending on the settings, return either a post's URL link (if it has one) or its page URL.
 * @param {Object} post
 */
Posts.getShareableLink = function (post) {
    return Telescope.settings.get("outsideLinksPointTo", "link") === "link" ? Posts.getLink(post) : Posts.getPageUrl(post, true);
};
Posts.helpers({
    getShareableLink: function () {
        return Posts.getShareableLink(this);
    }
});

/**
 * @summary Whether a post's link should open in a new tab or not
 * @param {Object} post
 */
Posts.getLinkTarget = function (post) {
    return !!post.url ? "_blank" : "";
};
Posts.helpers({
    getLinkTarget: function () {
        return Posts.getLinkTarget(this);
    }
});

/**
 * @summary Get URL of a post page.
 * @param {Object} post
 * @param isAbsolute
 */
Posts.getPageUrl = function (post, isAbsolute = false) {
    const prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0, -1) : "";
    //return `${prefix}/posts/${post._id}/${post.slug}`;
    //http://scruby.site/?postId=3uczHttFPKTquxdTW&title=Dilkhusnagar%20blasts:%20NIA%20court%20gives%20death%20penalty%20to%20IM%20founder%20Yasin%20Bhatkal%20and%20four%20others%20|%20Latest%20News%20&%20Updates%20at%20Daily%20News%20&%20Analysis
    return `${prefix}/?postId=${post._id}&title=${post.slug}`;
};

Posts.getArticleUrl = function (post, checkStatus = Posts.config.STATUS_APPROVED) {
    if (!!post && post.status === checkStatus) {
        return {pathname: '/', query: {postId: post._id, title: post.slug}};
    }
    return null;
};
Posts.helpers({
    getPageUrl: function (isAbsolute) {
        return Posts.getPageUrl(this, isAbsolute);
    },
    getArticleUrl: function (checkStatus) {
        return Posts.getPageUrl(this, checkStatus);
    }
});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a post author's name
 * @param {Object} post
 */
Posts.getAuthorName = function (post) {
    let user = Meteor.users.findOne(post.userId);
    if (user) {
        return user.getDisplayName();
    } else {
        return post.author;
    }
};
Posts.helpers({
    getAuthorName: function () {
        return Posts.getAuthorName(this);
    }
});

/**
 * @summary Get default status for new posts.
 * @param {Object} user
 */
Posts.getDefaultStatus = function (user) {
    const canPostApproved = typeof user === 'undefined' ? false : Users.canDo(user, "posts.new.approved");
    if (!Telescope.settings.get('requirePostsApproval', false) || canPostApproved) {
        // if user can post straight to "approved", or else post approval is not required
        return Posts.config.STATUS_APPROVED;
    } else {
        return Posts.config.STATUS_PENDING;
    }
};

/**
 * @summary Check if a post is approved
 * @param {Object} post
 */
Posts.isApproved = function (post) {
    return post.status === Posts.config.STATUS_APPROVED;
};
Posts.helpers({
    isApproved: function () {
        return Posts.isApproved(this);
    }
});

/**
 * @summary Check if a post is pending
 * @param {Object} post
 */
Posts.isPending = function (post) {
    return post.status === Posts.config.STATUS_PENDING;
};
Posts.helpers({
    isPending: function () {
        return Posts.isPending(this);
    }
});

/**
 * @summary Check to see if post URL is unique.
 * We need the current user so we know who to upvote the existing post as.
 * @param {String} url
 */
Posts.checkForSameUrl = function (url) {

    // check that there are no previous posts with the same link in the past 6 months
    let sixMonthsAgo = moment().subtract(6, 'months').toDate();
    let postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

    if (typeof postWithSameLink !== 'undefined') {
        throw new Meteor.Error('603', 'this_link_has_already_been_posted', postWithSameLink._id);
    }
};

/**
 * @summary When on a post page, return the current post
 */
Posts.current = function () {
    return Posts.findOne("foo");
};

/**
 * @summary Check to see if a post is a link to a video
 * @param {Object} post
 */
Posts.isVideo = function (post) {
    return post.media && post.media.type === "video";
};
Posts.helpers({
    isVideo: function () {
        return Posts.isVideo(this);
    }
});

Posts.getDefaultImageFromType = (post, type) => {
    const scraped_user_id = Telescope.settings.get('scraped_user_id');
    if (post.userId === scraped_user_id) {
        const author = post.author;
        if (!!author) {
            return '/packages/public/images/' + author + '.jpg';
        }
    }

    return null;
};

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 * @param type
 */
Posts.getImageFromType = (post, type) => {
    let thumbnailUrl = null;
    // http://localhost:3000/cdn/storage/undefined/268cc214-4cd0-47a8-a2d2-444d72eaa5b1/thumbnail400/268cc214-4cd0-47a8-a2d2-444d72eaa5b1
    // http://localhost:3000/files/images/Images/39c72a14-2bec-4d5c-b9de-fc076b26e026/thumbnail400/39c72a14-2bec-4d5c-b9de-fc076b26e026.jpg

    let imageId = post['cloudinaryId'];
    if (!!imageId) {
        thumbnailUrl = Mimages.getUrlByType(imageId, type);
    }
    if (!thumbnailUrl && !!post.thumbnailUrl) {
        thumbnailUrl = post.thumbnailUrl;
    }
    if (!!thumbnailUrl) {
        return thumbnailUrl.indexOf('//') > -1 ? Telescope.utils.addHttp(thumbnailUrl) : Telescope.utils.getSiteUrl().slice(0, -1) + thumbnailUrl;
    }

    return Posts.getDefaultImageFromType(post, type);
};

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 */
Posts.getThumbnailSet = (post) => {
    const small = Posts.getImageFromType(post, "thumbnail80");
    const large = Posts.getImageFromType(post, "thumbnail400");

    return {small: small, large: large};
};

Posts.getRelatedThumbnailSet = (post) => {
    const small = Posts.getImageFromType(post, "thumbnail80");
    const large = Posts.getImageFromType(post, "thumbnail80");

    return {small: small, large: large};
};
/**
 * @summary Get the complete detailed page image url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 */
Posts.getDetailedPageImageSet = (post) => {
    const small = Posts.getImageFromType(post, "thumbnail400");
    const large = Posts.getImageFromType(post, "original");

    return {small: small, large: large};
};

Posts.helpers({
    getThumbnailSet() {
        return Posts.getThumbnailSet(this);
    },
    getRelatedThumbnailSet(){
        return Posts.getRelatedThumbnailSet(this);
    },
    getDetailedPageImageUrl() {
        return Posts.getDetailedPageImageUrl(this);
    },
    getDetailedPageImageSet() {
        return Posts.getDetailedPageImageSet(this);
    },
    getDefaultImageFromType(){
        return Posts.getDefaultImageFromType(this);
    }
});

/**
 * @summary Get URL for sharing on Twitter.
 * @param {Object} post
 */
Posts.getTwitterShareUrl = post => {
    const via = Telescope.settings.get("twitterAccount", null) ? `&via=${Telescope.settings.get("twitterAccount")}` : "";
    return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(post.title) }%20${ encodeURIComponent(Posts.getLink(post, true)) }${via}`;
};
Posts.helpers({
    getTwitterShareUrl() {
        return Posts.getTwitterShareUrl(this);
    }
});

/**
 * @summary Get URL for sharing on Facebook.
 * @param {Object} post
 */
Posts.getFacebookShareUrl = post => {
    return `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(Posts.getLink(post, true)) }`;
};
Posts.helpers({
    getFacebookShareUrl() {
        return Posts.getFacebookShareUrl(this);
    }
});

/**
 * @summary Get URL for sharing by Email.
 * @param {Object} post
 */
Posts.getEmailShareUrl = post => {
    const subject = `Interesting link: ${post.title}`;
    const body = `I thought you might find this interesting:

${post.title}
${Posts.getLink(post, true, false)}

(found via ${Telescope.settings.get("siteUrl")})
  `;
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
Posts.helpers({
    getEmailShareUrl() {
        return Posts.getEmailShareUrl(this);
    }
});

/**
 * @summary Convert date to string using moment.js
 * @param {Object} date
 */
Posts.getDailyDateTitle = function (date) {
    let title = "";

    if (!!date) {
        let REFERENCE = moment(new Date()); // today
        let TODAY = REFERENCE.clone().startOf('day');
        let YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');

        const momentDate = moment(date);
        let prefix = "";
        if (momentDate.isSame(TODAY, 'd')) {
            title = "Today, " + momentDate.format("MMMM Do");
        } else if (momentDate.isSame(YESTERDAY, 'd')) {
            title = "Yesterday, " + momentDate.format("MMMM Do");
        } else {
            title = momentDate.format("dddd, MMMM Do");
        }
    }

    return title;
};

Posts.helpers({
    getDailyDateTitle: function () {
        return Posts.getDailyDateTitle(this);
    }
});

/**
 * @summary limit the post's content
 * @param {Object} content
 * @param limit
 */
Posts.getLimitedContent = function (content, limit) {
    let mytextlet = content;

    if ((content).length > limit) {
        mytextlet = content.substring(0, limit - 3) + '...';
    }
    return mytextlet;
};
Posts.helpers({
    getLimitedContent: function () {
        return Posts.getLimitedContent(this);
    }
});

/**
 * @summary limit the post's content
 * @param {Object} string
 */
Posts.getEmojiStripedString = function (string) {
    //string = "thumbs-up👍 for staying strong💪 without emoji please🙏";
    //string = "Say Hello to Twenty Seventeen 👋🏽";
    //let emoji = emoji = 'dealing with emoji😡 makes me feel like poop💩';
    //console.log(emojiStrip(emoji));

    return emojiStrip(string);
};
Posts.helpers({
    getEmojiStripedString: function () {
        return Posts.getEmojiStripedString(this);
    }
});

/**
 * @summary generate 15 days as the day filter for posts list admin
 */
Posts.getDateQueryString = function (date) {
    return moment(date).format("YYYY-MM-DD");
};
Posts.helpers({
    getDateQueryString: function () {
        return Posts.getDateQueryString(this);
    }
});

//Posts.getRelatedLists = function (post, limit, publish) {
//    const postId = post._id;
//    const author = post.author;
//
//    let parameters = {};
//    if (publish) {
//        parameters = {selector: {}, options: {limit: limit, sort: {score: -1}}};
//        parameters = Telescope.utils.deepExtend(true, parameters, {
//            selector: {
//                $or: [
//                    {_id: {$in: [postId]}},
//                    {author: author}
//                ]
//            }
//        });
//    } else {
//        // for related post list.
//        parameters = {selector: {_id: {$nin: [postId]}, author: author}, options: {limit: limit, sort: {score: -1}}};
//    }
//
//    return Posts.find(parameters.selector, parameters.options)
//};

Posts.getRelatedLists = function (post, limit) {
    const postId = post._id;
    const author = post.author;

    // for related post list.
    let parameters = {selector: {_id: {$nin: [postId]}, author: author}, options: {limit: limit, sort: {score: -1}}};

    const posts = Posts.find(parameters.selector, parameters.options);

    let postIds = _.pluck(posts.fetch(), '_id');
    return postIds;
};
Posts.helpers({
    getRelatedLists: function () {
        return Posts.getRelatedLists(this);
    }
});

/**
 * @summary generate 15 days as the day filter for posts list admin
 */
Posts.getDateSelectors = function () {
    const size = 15;
    let REFERENCE = moment(new Date()); // today
    let currentYear = REFERENCE.format("YYYY");

    const dateSelectors = [];
    for (var i = 0; i < size; i++) {
        const date = REFERENCE.clone().subtract(i, 'months');
        const queryString = moment(date).format("YYYY-MM");
        const year = moment(date).format("YYYY");
        //if (currentYear !== year) {
        //break;
        //}

        const title = date.format("MMMM YYYY");
        dateSelectors.push({"query": queryString, "title": title});
    }

    return dateSelectors;
};
Posts.helpers({
    getDateSelectors: function () {
        return Posts.getDateSelectors(this);
    }
});

/**
 *
 * @summary statistic topics.
 */
Posts.statisticTopics = function (topics) {
    //const topics_filter_keys = Telescope.settings.get("TOPICS_FILTER_KEYS", "").toLowerCase().trim();
    //
    //const filter_topics = _.filter(topics, function (item) {
    //    return topics_filter_keys.indexOf(item.name.toLowerCase()) == -1;
    //});
    _.forEach(topics, function (item) {
        // TODO: djzhang(Topics): All topic's id is generated by name.toLowerCase()
        let newId = md5(item.name.toLowerCase());
        let topic = Topics.findOne({_id: newId});
        if (!!topic > 0) {// edit
            Topics.update({'_id': item._id}, {'$inc': {'statistic.postCount': 1}});
        } else { // new
            topic = {
                _id: newId,
                name: item.name,
                slug: item.slug
            };
            Topics.insert(topic);
        }

        //console.log("edit topic: " + item.name);
    });
};
Posts.helpers({
    statisticTopics: function () {
        return Posts.statisticTopics(this);
    }
});

/**
 * @summary statistic topics.
 */
Posts.generatePostListTitle = function (query) {
    let title = null;

    if (query.query) {
        title = "Posts in " + query.query;
    }
    else if (query.from) {
        title = "Posts in " + query.from;
    }
    else if (query.author) {
        title = "Posts in " + query.author;
    } else if (query.userId) {
        title = "Posts by " + query.title;
    }
    else if (query.after) {
        if (query.cat || query.topicId) {
            title = query.title + " on " + moment(query.after).format("MMMM Do");
        } else {
            title = Posts.getDailyDateTitle(moment(query.after));
        }
    } else if (query.cat || query.topicId) {
        title = "Posts in " + query.title;
    }

    if (query.admin) {
        if (!title) {
            let status = query.status;
            title = "Posts in " + status;
        }
        title += " [APPROVING]";
    }

    return {showHeader: !!title, title: title};
};

Posts.helpers({
    generatePostListTitle: function () {
        return Posts.generatePostListTitle(this);
    }
});

Posts.getPostStatusTitle = (status) => {
    return Posts.config.STATUS_TITLES[status];
};
Posts.getPostMessageStatusTitle = (post) => {
    return Posts.config.STATUS_MESSAGE_TITLES[post.status];
};

Posts.getPostStatus = (post, state) => {
    let statusArray = [];
    let postStatus = Posts.config.STATUS_CHECKING[post.status];
    if (state.toLowerCase() !== postStatus.toLowerCase()) {
        if (post.status !== Posts.config.STATUS_APPROVED) {
            statusArray.push(postStatus);
        }
    }

    return statusArray;
};

Posts.isRemovedPost = function (post) {
    return post.status === Posts.config.STATUS_REMOVED;
};

Posts.generateTwitterShareLink = function (post) {

    const twitterVia = Telescope.settings.get("twitterAccount", "Getpoliticl");
    const splits = [];
    splits.push("url=" + post.url);
    splits.push("via=" + twitterVia);
    splits.push("text=" + post.title);

    return 'https://twitter.com/share?' + splits.join("&");
};

/**
 *
 * https://www.facebook.com/dialog/share?
 * app_id=1549529981961270&href=http://scruby.site/?postId=hHMiCtoJkHEN56tQB&title=a-snapdragon-835-powered-windows-10-device-isn-t-far-away&quote=
 *
 */
Posts.generateFacebookShareLink = function (post) {
    //splits.push("u=" + post.url);
    let facebookId = Telescope.settings.get('FACEBOOK_APP_ID');
    const splits = [];
    splits.push("app_id=" + facebookId);
    splits.push("href=" + post.url);
    splits.push("quote=");
    return "https://www.facebook.com/dialog/share?" + splits.join("&");
};

Posts.generateCommentTwitterShareLink = function (comment) {

    //href="https://twitter.com/share?
    //url=https%3A%2F%2Fdev.twitter.com%2Fweb%2Ftweet-button&
    //via=twitterdev&
    //related=twitterapi%2Ctwitter&
    //hashtags=example%2Cdemo&
    //text=custom%20share%20text"

    //$(location).attr('href');

    const userName = Users.getDisplayName(comment.user);

    const url = "";
    let text = comment.body;
    text = '\"' + text.substring(0, 50) + '...\"' + " — " + userName;

    const splits = [];
    splits.push("url=" + url);
    splits.push("text=" + text);
    const link = 'https://twitter.com/share?' + splits.join("&");

    return link;
};

Posts.generateCommentFacebookShareLink = function (comment) {
    //https://www.facebook.com/dialog/feed?app_id=1389892087910588
    //  &redirect_uri=https://scotch.io
    //  &link=https://scotch.io
    //  &picture=http://placekitten.com/500/500
    //  &caption=This%20is%20the%20caption
    //  &description=This%20is%20the%20description

    //const {comment} = this.props;
    //var facebookId = Telescope.settings.get('FACEBOOK_APP_ID');
    //var redirect_uri = Telescope.settings.get('REDIRECT_URI');

    const url = "";
    const splits = [];

    splits.push("u=" + url);

    //return "https://www.facebook.com/dialog/feed?" + splits.join("&");
    const link = "https://www.facebook.com/sharer.php?" + splits.join("&");

    return link;
};

Posts.showReady = function (results, hasMore, ready, count, totalCount, limit, firstPagination) {
    if (!firstPagination) { // ignoring it, if not the first pagination.
        return false;
    }
    if (typeof totalCount === "undefined" || !ready || typeof results === "undefined") {
        return true;
    }
    if (ready && !hasMore && results.length === 0) {//empty list
        return false;
    }
    if (!ready && hasMore && results.length <= limit) {// first pagination and already ready.
        return true;
    }
    if (hasMore && !!results && results.length > limit) {
        return false;
    }
    if (hasMore && (results.length % limit) !== 0) {
        return true;
    }
    return false;
};

Posts.helpers({
    isRemovedPost: function () {
        return Posts.isRemovedPost(this);
    },
    getPostStatus: function () {
        return Posts.getPostStatus(this);
    },
    getPostStatusTitle: function () {
        return Posts.getPostStatusTitle(this);
    },
    getPostMessageStatusTitle: function () {
        return Posts.getPostMessageStatusTitle(this);
    },
    generateTwitterShareLink: function () {
        return Posts.generateTwitterShareLink(this);
    },
    generateFacebookShareLink: function () {
        return Posts.generateFacebookShareLink(this);
    },
    generateCommentTwitterShareLink: function () {
        return Posts.generateCommentTwitterShareLink(this);
    },
    generateCommentFacebookShareLink: function () {
        return Posts.generateCommentFacebookShareLink(this);
    },
    showReady: function () {
        return Posts.showReady(this);
    }
});

Posts.getNormalPostStatusSet = () => {
    return [
        {value: -1, title: '— No Change —'},
        {value: Posts.config.STATUS_APPROVED, title: 'Published'},
        {value: Posts.config.STATUS_PENDING, title: 'Pending Review'},
        {value: Posts.config.STATUS_REJECTED, title: 'Rejected'},
        {value: Posts.config.STATUS_SPAM, title: 'Draft'}
    ];
};

Posts.helpers({
    getNormalPostStatusSet: function () {
        return Posts.getNormalPostStatusSet(this);
    }
});

Posts.parseDomain = (url) => {
    let parse_domain = parseDomain(url);

    if (!!parse_domain) {
        let subdomain = parse_domain.subdomain,
          domain = parse_domain.domain,
          tld = parse_domain.tld;

        if (subdomain.length > 10) {
            subdomain = '';
        }

        return (((subdomain === 'www') || (subdomain == '')) ? [domain, tld] : [subdomain, domain, tld]).join('.');
    }

    let split = url.split('//');
    if (split.length > 2) {
        let right = split[1];
        let s = right.split('/');
        if (s.length > 2) {
            let domain = s[0].replace('www.', "");
            return domain;
        }
    }

    return "";
};

Posts.helpers({
    getPostStatus: function () {
        return Posts.getPostStatus(this);
    }
});

Posts.getTotalCount = (props, status) => {
    let count = 0;
    switch (status) {
        case "publish":
            count = props.publishCount;
            break;
        case "flag":
            count = props.flaggedCount;
            break;
        case "pending":
            count = props.pendingCount;
            break;
        case "reject":
            count = props.rejectedCount;
            break;
        case "draft":
            count = props.draftCount;
            break;
        case "trash":
            count = props.trashCount;
            break;
        default:
            count = props.allCount;
            break;
    }

    return count;
};

Posts.helpers({
    getTotalCount: function () {
        return Posts.getTotalCount(this);
    }
});


