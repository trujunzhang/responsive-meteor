import Telescope from 'meteor/nova:lib';
import Flags from "./collection.js";

/**
 * @summary Parameter callbacks let you add parameters to subscriptions
 * @namespace Flags.parameters
 */
Flags.parameters = {};

/**
 * @summary Takes a set of terms, and translates them into a `parameter` object containing the appropriate find
 * and options arguments for the subscriptions's Flags.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Flags.parameters.get = function (terms) {

    // add this to ensure all flag publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters with empty object
    let parameters = {
        selector: {},
        options: {}
    };

    // iterate over flags.parameters callbacks
    parameters = Telescope.callbacks.run("flags.parameters", parameters, _.clone(terms));

    // if sort options are not provided, default to "createdAt" sort
    if (_.isEmpty(parameters.options.sort)) {
        parameters.options.sort = {createdAt: -1};
    }

    // extend sort to sort flags by _id to break ties
    // NOTE: always do this last to avoid _id sort overriding another sort
    parameters = Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

    // console.log(parameters);

    return parameters;
};

// Tag Parameter
// Add a "tags" property to terms which can be used to filter *all* existing Posts views.
function addFlagParameter(parameters, terms) {

    var flagID = terms.flagId;

    // filter by flagID if flagID slugs are provided
    if (flagID) {
        const options = {fields: Flags.publishedFields.single};
        const flags = Flags.find({_id: flagID}, options);
        const flag = flags.fetch()[0];

        if (flag) {
            const postIds = flag.posts;

            parameters.selector._id = {$in: postIds};
        }
    }
    return parameters;
}
Telescope.callbacks.add("posts.parameters", addFlagParameter);
