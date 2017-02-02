import PoliticlHistory from './collection.js';

/**
 * @summary Topic views are filters used for subscribing to and viewing topics
 * @namespace PoliticlHistory.views
 */
PoliticlHistory.views = {};

/**
 * @summary Add a module to a topic view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
PoliticlHistory.views.add = function (viewName, viewFunction) {
    PoliticlHistory.views[viewName] = viewFunction;
};

PoliticlHistory.views.add("trending", function (terms) {
    return {
        selector: {is_ignore: false},
        options: {
            limit: 10,
            sort: {
                'created_at': -1
            }
        }
    };
});

// will be common to all other view unless specific properties are overwritten
PoliticlHistory.views.baseParameters = {
    selector: {},
    options: {
        sort: {'created_at': -1}
    }
};
