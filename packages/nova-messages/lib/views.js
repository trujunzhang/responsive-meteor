import Users from 'meteor/nova:users';
import Messages from './collection.js'

/**
 * @summary Post views are filters used for subscribing to and viewing posts
 * @namespace Messages.views
 */
Messages.views = {};

/**
 * @summary Add a post view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Messages.views.add = function (viewName, viewFunction) {
    Messages.views[viewName] = viewFunction;
};

/**
 * @summary Base parameters that will be common to all other view unless specific properties are overwritten
 */
Messages.views.baseParameters = {
    selector: {}
};

/**
 * @summary Scheduled view
 */
Messages.views.add("popover", function (terms) {
    return {
        selector: {},
        options: {
            limit: terms.limit,
            sort: {createdAt: -1}
        }
    };
});


