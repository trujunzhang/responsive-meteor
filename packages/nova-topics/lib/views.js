import Topics from './collection.js';

/**
 * @summary Topic views are filters used for subscribing to and viewing topics
 * @namespace Topics.views
 */
Topics.views = {};

/**
 * @summary Add a module to a topic view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Topics.views.add = function (viewName, viewFunction) {
    Topics.views[viewName] = viewFunction;
};

Topics.views.add("trending", function (terms) {
    return {
        selector: {is_ignore: false},
        options: {
            limit: 10,
            sort: {
                'statistic.postCount': -1
            }
        }
    };
});

// will be common to all other view unless specific properties are overwritten
Topics.views.baseParameters = {
    selector: {},
    options: {
        sort: {'statistic.postCount': -1}
    }
};
