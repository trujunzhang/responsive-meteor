import Telescope from 'meteor/nova:lib';
import {Injected} from 'meteor/meteorhacks:inject-initial';
import moment from 'moment';
import Posts from './collection.js';

/**
 * @summary Parameter callbacks let you add parameters to subscriptions
 * @namespace Posts.parameters
 */
Posts.parameters = {};

/**
 * @summary Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Posts.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Posts.parameters.get = function (terms) {

    // add this to ensure all post publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters with empty object
    let parameters = {
        selector: {},
        options: {}
    };

    // iterate over posts.parameters callbacks
    parameters = Telescope.callbacks.run("posts.parameters", parameters, _.clone(terms));

    // if sort options are not provided, default to "createdAt" sort
    if (_.isEmpty(parameters.options.sort)) {
        parameters.options.sort = {sticky: -1, createdAt: -1};
    }

    // extend sort to sort posts by _id to break ties
    // NOTE: always do this last to avoid _id sort overriding another sort
    //parameters = Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id(no need): -1}}});

    // console.log(parameters);

    return parameters;
};

// Parameter callbacks

// View Parameter
// Add a "view" property to terms which can be used to filter posts.
function addViewParameter(parameters, terms) {

    // if view is not defined, default to "new"
    let view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'new';

    // get query parameters according to current view
    if (typeof Posts.views[view] !== 'undefined')
        parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addViewParameter);

// View Parameter
// Add "after" and "before" properties to terms which can be used to limit posts in time.
function addTimeParameter(parameters, terms) {

    // console.log("// addTimeParameter")

    if (typeof parameters.selector.postedAt === "undefined") {

        let postedAt = {}, mAfter, mBefore, startOfDay, endOfDay, clientTimezoneOffset, serverTimezoneOffset, timeDifference;

        /*

         If we're on the client, add the time difference between client and server

         Example: client is on Japanese time (+9 hours),
         server on UCT (Greenwich) time (+0 hours), for a total difference of +9 hours.

         So the time "00:00, UCT" is equivalent to "09:00, JST".

         So if we want to express the timestamp "00:00, UCT" on the client,
         we *add* 9 hours to "00:00, JST" on the client to get "09:00, JST" and
         sync up both times.

         */

        if (Meteor.isClient) {
            clientTimezoneOffset = -1 * new Date().getTimezoneOffset();
            serverTimezoneOffset = -1 * Injected.obj('serverTimezoneOffset').offset;
            timeDifference = clientTimezoneOffset - serverTimezoneOffset;

            // console.log("client time:"+clientTimezoneOffset);
            // console.log("server time:"+serverTimezoneOffset);
            // console.log("difference: "+timeDifference);
        }

        if (terms.after) {

            // console.log("// after: "+terms.after);

            mAfter = moment(terms.after, "YYYY-MM-DD");
            startOfDay = mAfter.startOf('day');

            // console.log("// normal      ", mAfter.toDate(), mAfter.valueOf());
            // console.log("// startOfDay  ", startOfDay.toDate(), startOfDay.valueOf());

            if (Meteor.isClient) {
                startOfDay.add(timeDifference, "minutes");
                // console.log("// after add   ", startOfDay.toDate(), startOfDay.valueOf());
            }

            postedAt.$gte = startOfDay.toDate();
        }

        if (terms.before) {

            mBefore = moment(terms.before, "YYYY-MM-DD");
            endOfDay = mBefore.endOf('day');

            if (Meteor.isClient) {
                endOfDay.add(timeDifference, "minutes");
            }

            postedAt.$lt = endOfDay.toDate();

        }

        if (!_.isEmpty(postedAt)) {
            parameters.selector.postedAt = postedAt;
        }

    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addTimeParameter);

// View Parameter
// Add "after" and "before" properties to terms which can be used to limit posts in time.
function addDateParameter(parameters, terms) {

    // console.log("// addTimeParameter")

    if (typeof parameters.selector.postedAt === "undefined") {

        let postedAt = {}, startDate, endDate;

        /*

         If we're on the client, add the time difference between client and server

         Example: client is on Japanese time (+9 hours),
         server on UCT (Greenwich) time (+0 hours), for a total difference of +9 hours.

         So the time "00:00, UCT" is equivalent to "09:00, JST".

         So if we want to express the timestamp "00:00, UCT" on the client,
         we *add* 9 hours to "00:00, JST" on the client to get "09:00, JST" and
         sync up both times.

         */
        let date = terms.date;
        if (date && date !== '0') {
            let split = date.split('-');

            let year = split[0];
            let month = split[1];
            month = parseInt(month) - 1;

            startDate = moment([year, month]).startOf('month');
            endDate = moment(startDate).endOf('month');

            postedAt.$gte = startDate.toDate();
            postedAt.$lt = endDate.toDate();
        }

        if (!_.isEmpty(postedAt)) {
            parameters.selector.postedAt = postedAt;
        }

    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addDateParameter);

// limit the number of items that can be requested at once
function limitPosts(parameters, terms) {
    let maxLimit = 200;

    // 1. set default limit to 10
    let limit = 10;

    // 2. look for limit on terms.limit
    if (terms.limit) {
        limit = parseInt(terms.limit);
    }

    // 3. look for limit on terms.options.limit
    if (terms.options && terms.options.limit) {
        limit = parseInt(terms.options.limit);
    }

    // 4. make sure limit is not greater than 200
    if (limit > maxLimit) {
        limit = maxLimit;
    }

    // 5. initialize parameters.options if needed
    if (!parameters.options) {
        parameters.options = {};
    }

    // 6. set limit
    parameters.options.limit = limit;

    return parameters;
}
Telescope.callbacks.add("posts.parameters", limitPosts);

function addDomainSearchParameter(parameters, terms) {

    let sourceFrom = terms.from || terms["from[]"];

    // filter by sourceFrom if sourceFrom slugs are provided
    if (sourceFrom) {
        parameters.selector.sourceFrom = sourceFrom;
    }
    return parameters;
}
Telescope.callbacks.add("posts.parameters", addDomainSearchParameter);

function addCuratorSearchParameter(parameters, terms) {

    let author = terms.author || terms["author[]"];

    // filter by author if author slugs are provided
    if (author) {
        parameters.selector.author = author;
    }
    return parameters;
}
Telescope.callbacks.add("posts.parameters", addCuratorSearchParameter);

function addFilterPostParameter(parameters, terms) {

    let filterPosts = terms.filter || terms["filter[]"];

    // filter by filterPosts if filterPosts slugs are provided
    if (filterPosts) {
        parameters.selector._id = {$nin: [filterPosts]};
    }
    return parameters;
}
Telescope.callbacks.add("posts.parameters", addFilterPostParameter);

function addUserVotePostsParameter(parameters, terms) {
    let cachedIds = terms.cachedIds;
    if (!!cachedIds) {
        parameters.selector._id = {$in: cachedIds};
    }

    //let upvoter = terms.upvoter;
    //if (upvoter) {
    //    parameters.selector['upvoters'] = {$in: [upvoter]};
    //}
    //let downvoter = terms.downvoter;
    //if (downvoter) {
    //    parameters.selector['downvoters'] = {$in: [downvoter]};
    //}

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addUserVotePostsParameter);

function addUserSummitedPostsParameter(parameters, terms) {

    let submitter = terms.submitter;
    if (submitter) {
        parameters.selector['userId'] = submitter;
    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addUserSummitedPostsParameter);

function addUserSummitedPostsForAdminParameter(parameters, terms) {

    let userId = terms.userId;
    if (userId) {
        parameters.selector['userId'] = userId;
    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addUserSummitedPostsForAdminParameter);

function addPopoverPostsParameter(parameters, terms) {
    let popoverPostId = terms.popoverPostId;
    if (popoverPostId) {
        parameters.selector._id = popoverPostId;
    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addPopoverPostsParameter);

function addStatusPostsParameter(parameters, terms) {
    let type = terms.type;
    let postsType = terms.postsType;
    let status = terms.status;

    // Default posts.list's status
    parameters.selector.status = Posts.config.STATUS_APPROVED;
    if (!!postsType && postsType === "user.posts") {
        parameters.selector.status = {$in: Posts.config.ALL_STATUS_FOR_USER_PROFILE};
    }
    if (!!terms.admin) {// for admin list
        parameters.selector.status = {$in: Posts.config.ALL_STATUS};
    }
    if (!!type) {
        parameters.selector.status = {$in: Posts.config.PUBLISH_STATUS};

        if (!!status) {
            switch (status) {
                case "publish":
                    parameters.selector.status = Posts.config.STATUS_APPROVED;
                    break;
                case "pending":
                    parameters.selector.status = Posts.config.STATUS_PENDING;
                    break;
                case "reject":
                    parameters.selector.status = Posts.config.STATUS_REJECTED;
                    break;
                case "draft":
                    parameters.selector.status = Posts.config.STATUS_SPAM;
                    break;
                case "trash":
                    parameters.selector.status = Posts.config.STATUS_DELETED;
                    break;
            }
        }
    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addStatusPostsParameter);
