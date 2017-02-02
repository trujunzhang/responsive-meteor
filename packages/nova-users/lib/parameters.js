import Telescope from 'meteor/nova:lib';
import Users from './collection.js'
import moment from 'moment';

/**
 * @summary Parameter callbacks let you add parameters to subscriptions
 * @namespace Users.parameters
 */
Users.parameters = {};

/**
 * @summary Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Users.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Users.parameters.get = function (terms) {

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

    // iterate over users.parameters callbacks
    parameters = Telescope.callbacks.run("users.parameters", parameters, _.clone(terms));

    // if sort options are not provided, default to "createdAt" sort
    if (_.isEmpty(parameters.options.sort)) {
        parameters.options.sort = {createdAt: -1};
    }

    // extend sort to sort posts by _id to break ties
    // NOTE: always do this last to avoid _id sort overriding another sort
    parameters = Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

    // console.log(parameters);

    return parameters;
};

// Parameter callbacks

// View Parameter
// Add "after" and "before" properties to terms which can be used to limit posts in time.
function addRoleParameter(parameters, terms) {

    // console.log("// addTimeParameter")
    if (terms.role) {
        if (terms.role == "administrator") {
            parameters.selector.isAdmin = true;
        }
    }

    return parameters;
}
Telescope.callbacks.add("users.parameters", addRoleParameter);

function addLoginParameter(parameters, terms) {

    // console.log("// addTimeParameter")
    if (terms.login) {
        if (terms.login == "passwordless") {
            parameters.selector.loginType = Users.config.TYPE_PASSWORDLESS;
        } else if (terms.login == "facebook") {
            parameters.selector.loginType = Users.config.TYPE_FACEBOOK;
        } else if (terms.login == "twitter") {
            parameters.selector.loginType = Users.config.TYPE_TWITTER;
        } else if (terms.login == "google") {
            parameters.selector.loginType = Users.config.TYPE_GOOGLE;
        } else if (terms.login == "github") {
            parameters.selector.loginType = Users.config.TYPE_GITHUB;
        } else if (terms.login == "linkedin") {
            parameters.selector.loginType = Users.config.TYPE_LINKEDIN;
        }
    }

    return parameters;
}
Telescope.callbacks.add("users.parameters", addLoginParameter);

