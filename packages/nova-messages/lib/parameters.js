import Telescope from 'meteor/nova:lib';
import Messages from "./collection.js";

/**
 * @summary Parameter callbacks let you add parameters to subscriptions
 * @namespace Messages.parameters
 */
Messages.parameters = {};

/**
 * @summary Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Messages.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Messages.parameters.get = function (terms) {

    // add this to ensure all message publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters with empty object
    let parameters = {
        selector: {},
        options: {}
    };

    // iterate over messagesParameters callbacks
    parameters = Telescope.callbacks.run("messagesParameters", parameters, _.clone(terms));

    // if sort options are not provided, default to "createdAt" sort
    if (_.isEmpty(parameters.options.sort)) {
        parameters.options.sort = {createdAt: -1};
    }

    // console.log(parameters);

    return parameters;
};

// View Parameter
// Add a "view" property to terms which can be used to filter messages.
function addViewParameter(parameters, terms) {

    // if view is not defined, default to "new"
    let view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'new';

    // get query parameters according to current view
    if (typeof Messages.views[view] !== 'undefined')
        parameters = Telescope.utils.deepExtend(true, parameters, Messages.views[view](terms));

    return parameters;
}
Telescope.callbacks.add("messagesParameters", addViewParameter);


function addUserParameter(parameters, terms) {

    let userId = terms.userId;
    if (!!userId) {
        parameters.selector.userId = userId;
    }

    return parameters;
}
Telescope.callbacks.add("messagesParameters", addUserParameter);
