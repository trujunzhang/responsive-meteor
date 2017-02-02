import Telescope from 'meteor/nova:lib';
import PoliticlCaches from './collection.js';

PoliticlCaches.parameters = {
    selector: {},
    options: {sort: {'created_at': -1}}
};

/**
 * @summary Gives an object containing the appropriate find
 * and options arguments for the subscriptions's PoliticlCaches.find()
 * @memberof Parameters
 * @param {Object} terms
 */
PoliticlCaches.parameters.get = function (terms) {

    // add this to ensure all post publications pass audit-arguments-check
    check(terms, Match.Any);

    // console.log(terms)

    // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
    // see: http://api.jquery.com/jQuery.extend/

    // initialize parameters by extending baseParameters object, to avoid passing it by reference
    let parameters = Telescope.utils.deepExtend(true, {}, PoliticlCaches.views.baseParameters);

    // get query parameters according to current view
    if (typeof PoliticlCaches.views[terms.view] !== 'undefined')
        parameters = Telescope.utils.deepExtend(true, parameters, PoliticlCaches.views[terms.view](terms));

    // iterate over politicl.caches.parameters callbacks
    parameters = Telescope.callbacks.run("politicl.caches.parameters", parameters, terms);

    // console.log(parameters);

    return parameters;
};

function limitSuggestionPoliticlCaches(parameters, terms) {
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
Telescope.callbacks.add("politicl.caches.parameters", limitSuggestionPoliticlCaches);

function addDomainSearchParameter(parameters, terms) {

    let sourceFrom = terms.from || terms["from[]"];

    // filter by sourceFrom if sourceFrom slugs are provided
    if (sourceFrom) {
        parameters.selector.url_from = sourceFrom;
    }
    return parameters;
}
Telescope.callbacks.add("politicl.caches.parameters", addDomainSearchParameter);




