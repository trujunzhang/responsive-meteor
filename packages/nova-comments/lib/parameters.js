import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';

Comments.parameters = {};

/**
 * @summary Gives an object containing the appropriate find
 * and options arguments for the subscriptions's Comments.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Comments.parameters.get = function (terms) {

    // add this to ensure all post publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters by extending baseParameters object, to avoid passing it by reference
    let parameters = Telescope.utils.deepExtend(true, {}, Comments.views.baseParameters);

    // get query parameters according to current view
    if (typeof Comments.views[terms.view] !== 'undefined')
        parameters = Telescope.utils.deepExtend(true, parameters, Comments.views[terms.view](terms));

    // iterate over commentsParameters callbacks
    parameters = Telescope.callbacks.run("comments.parameters", parameters, terms);

    // console.log(parameters);

    return parameters;
};

// limit the number of items that can be requested at once
function limitComments(parameters, terms) {
    let maxLimit = 1000;
    // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
    if (typeof terms.limit !== 'undefined') {
        _.extend(parameters.options, {limit: parseInt(terms.limit)});
    }

    // limit to "maxLimit" items at most when limit is undefined, equal to 0, or superior to maxLimit
    if (!parameters.options.limit || parameters.options.limit === 0 || parameters.options.limit > maxLimit) {
        parameters.options.limit = maxLimit;
    }
    return parameters;
}
Telescope.callbacks.add("comments.parameters", limitComments);

function userSubmittedComments(parameters, terms) {
    const userId = terms.userId;
    if (!!userId) {
        parameters.selector.userId = userId;
    }
    return parameters;
}
Telescope.callbacks.add("comments.parameters", userSubmittedComments);


function postSubmittedComments(parameters, terms) {
    const postId = terms.postId;
    if (!!postId) {
        parameters.selector.postId = postId;
    }
    return parameters;
}
Telescope.callbacks.add("comments.parameters", postSubmittedComments);


function addStatusCommentsParameter(parameters, terms) {
    let type = terms.type;
    let status = terms.status;

    // Default Comments.list's status
    parameters.selector.status = Comments.config.STATUS_APPROVED;
    if (!!terms.admin) {// for admin list
        parameters.selector.status = {$in: Comments.config.ALL_STATUS};
    }
    if (!!type) {
        parameters.selector.status = {$in: Comments.config.PUBLISH_STATUS};

        if (!!status) {
            switch (status) {
                case "approved":
                    parameters.selector.status = Comments.config.STATUS_APPROVED;
                    break;
                case "pending":
                    parameters.selector.status = Comments.config.STATUS_PENDING;
                    break;
                case "reject":
                    parameters.selector.status = Comments.config.STATUS_REJECTED;
                    break;
                case "spam": //"draft":
                    parameters.selector.status = Comments.config.STATUS_SPAM;
                    break;
                case "trash":
                    parameters.selector.status = Comments.config.STATUS_DELETED;
                    break;
            }
        }
    }

    return parameters;
}
Telescope.callbacks.add("comments.parameters", addStatusCommentsParameter);
