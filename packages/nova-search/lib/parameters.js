import Telescope from 'meteor/nova:lib';
import escapeStringRegexp from 'escape-string-regexp';

function addSearchQueryParameter(parameters, terms) {
    let array = [];

    let topicId = terms.topicId;
    let topicName = terms.title;
    let value = terms.query;

    // ** Trending Topics **
    //  (Point 4 Explanation):
    //    When a person clicks tag “Demonitisation” Link: http://scruby.site/?title=Demonetisation&topicId=a387097638dc4b5946f357176a0f33a7
    //    It should open search query “Demonitisation” Link: http://scruby.site/?query=Demonitisation
    //    Because we will not be able to add “Demonitisation” tag in every articles, but all articles will have the word “Demonitisation”.

    if (!!topicId && !!topicName) {
        value = topicName;
    }

    if (!!value) {
        const query = escapeStringRegexp(value);

        array = [
            {title: {$regex: query, $options: 'i'}},
            {url: {$regex: query, $options: 'i'}},
            // note: we cannot search the body field because it's not published
            // to the client. If we did, we'd get different result sets on
            // client and server
            {excerpt: {$regex: query, $options: 'i'}}
        ];
    }

    if (!!topicId) {
        array.push({topics: topicId});
    }

    if (array.length > 0) {
        parameters = Telescope.utils.deepExtend(true, parameters, {selector: {$or: array}});
    }

    return parameters;
}
Telescope.callbacks.add("posts.parameters", addSearchQueryParameter);

function addFlagsSearchQueryParameter(parameters, terms) {
    let array = [];

    let value = terms.query;

    if (!!value) {
        const query = escapeStringRegexp(value);

        array = [
            {reason: {$regex: query, $options: 'i'}}
        ];
    }

    if (array.length > 0) {
        parameters = Telescope.utils.deepExtend(true, parameters, {selector: {$or: array}});
    }

    return parameters;
}
Telescope.callbacks.add("flags.parameters", addFlagsSearchQueryParameter);

function addCommentsSearchQueryParameter(parameters, terms) {
    let array = [];

    let value = terms.query;

    if (!!value) {
        const query = escapeStringRegexp(value);

        array = [
            {body: {$regex: query, $options: 'i'}},
            {author: {$regex: query, $options: 'i'}}
        ];
    }

    if (array.length > 0) {
        parameters = Telescope.utils.deepExtend(true, parameters, {selector: {$or: array}});
    }

    return parameters;
}
Telescope.callbacks.add("comments.parameters", addCommentsSearchQueryParameter);

function addTopicSearchParameter(parameters, terms) {
    if (!!terms.query) {

        const query = escapeStringRegexp(terms.query);

        parameters = Telescope.utils.deepExtend(true, parameters, {
            selector: {
                $or: [
                    {name: {$regex: query, $options: 'i'}}
                ]
            }
        });
    }
    if (!!terms.exclude) {
        parameters.selector._id = {$nin: terms.exclude};
    }

    return parameters;
}
Telescope.callbacks.add("topics.parameters", addTopicSearchParameter);

function addUserSearchParameter(parameters, terms) {
    if (!!terms.query) {

        const query = escapeStringRegexp(terms.query);

        parameters = Telescope.utils.deepExtend(true, parameters, {
            selector: {
                $or: [
                    {"profile.name": {$regex: query, $options: 'i'}},
                    {"telescope.displayName": {$regex: query, $options: 'i'}}
                ]
            }
        });
    }
    return parameters;
}
Telescope.callbacks.add("users.parameters", addUserSearchParameter);

function addCacheSearchParameter(parameters, terms) {
    let array = [];
    if (!!terms.query) {
        const query = escapeStringRegexp(terms.query);

        array = [
            {"url": {$regex: query, $options: 'i'}},
            {"url_from": {$regex: query, $options: 'i'}}
        ];
    }
    if (!!terms.date) {
        array.push({"created_at": {$regex: terms.date, $options: 'i'}});
    }
    if (array.length > 0) {
        parameters = Telescope.utils.deepExtend(true, parameters, {selector: {$or: array}});
    }

    return parameters;
}
Telescope.callbacks.add("politicl.caches.parameters", addCacheSearchParameter);

function addHistorySearchParameter(parameters, terms) {
    let array = [];
    if (!!terms.query) {
        const query = escapeStringRegexp(terms.query);

        array = [
            {"url": {$regex: query, $options: 'i'}},
        ];
    }
    if (!!terms.date) {
        array.push({"created_at": {$regex: terms.date, $options: 'i'}});
    }
    if (array.length > 0) {
        parameters = Telescope.utils.deepExtend(true, parameters, {selector: {$or: array}});
    }

    return parameters;
}
Telescope.callbacks.add("politicl.history.parameters", addHistorySearchParameter);
