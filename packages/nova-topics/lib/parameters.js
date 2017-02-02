import Telescope from 'meteor/nova:lib';
import escapeStringRegexp from 'escape-string-regexp';

import Topics from './collection.js';

Topics.parameters = {
    selector: {},
    options: {sort: {'statistic.postCount': -1}}
};

/**
 * @summary Gives an object containing the appropriate find
 * and options arguments for the subscriptions's Topics.find()
 * @memberof Parameters
 * @param {Object} terms
 */
Topics.parameters.get = function (terms) {

    // add this to ensure all post publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters by extending baseParameters object, to avoid passing it by reference
    let parameters = Telescope.utils.deepExtend(true, {}, Topics.views.baseParameters);

    // get query parameters according to current view
    if (typeof Topics.views[terms.view] !== 'undefined')
        parameters = Telescope.utils.deepExtend(true, parameters, Topics.views[terms.view](terms));

    // iterate over topics.parameters callbacks
    parameters = Telescope.callbacks.run("topics.parameters", parameters, terms);

    // console.log(parameters);

    return parameters;
};

function limitSuggestionTopics(parameters, terms) {
    // 2. look for limit on terms.limit
    if (terms.limit) {
        const limit = parseInt(terms.limit);
        // 6. set limit
        parameters.options.limit = limit;
    }

    if (!!terms.query) {
        // 1. set default limit to 5
        let limit = 5;

        // 2. look for limit on terms.limit
        if (terms.limit) {
            limit = parseInt(terms.limit);
        }

        // 3. look for limit on terms.options.limit
        if (terms.options && terms.options.limit) {
            limit = parseInt(terms.options.limit);
        }

        // 6. set limit
        parameters.options.limit = limit;
    }

    return parameters;
}
Telescope.callbacks.add("topics.parameters", limitSuggestionTopics);

function addFilterKeysTopicsParameter(parameters, terms) {
    let filter_keys = terms.filter_keys;
    if (!!filter_keys) {
        let keys = filter_keys.trim().split(',');

        // (used)db.topics.find({name: {$nin:[/Opinion/i,/India/i,/Politics/i,/News/i,/Society/i]} })

        //parameters.selector.name = {$nin: [/Opinion/i, /India/i, /Politics/i, /News/i, /Society/i]};

        parameters = Telescope.utils.deepExtend(true, parameters, {
            selector: {
                name: {$nin: keys}
            }
        });
    }

    return parameters;
}
Telescope.callbacks.add("topics.parameters", addFilterKeysTopicsParameter);

function addStatusTopicsParameter(parameters, terms) {
    let status = terms.status;
    if (!!status) {
        parameters.selector.status = {$in: Topics.config.PUBLISH_STATUS};

        switch (status) {
            case "publish":
                parameters.selector.status = Topics.config.STATUS_APPROVED;
                parameters.selector.is_ignore = false;
                break;
            case "trash":
                parameters.selector.status = Topics.config.STATUS_DELETED;
                break;
            case "filter":
                parameters.selector.is_ignore = true;
                break;
        }
    }

    return parameters;
}
Telescope.callbacks.add("topics.parameters", addStatusTopicsParameter);




