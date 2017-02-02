import Users from 'meteor/nova:users';
import Topics from '../collection.js';

/**
 * @summary Publish a list of topics
 * @param {Object} terms
 */
Meteor.publish('topics.trending', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = Topics.parameters.get(terms));

    // topicing this because of FR-SSR issue
    // Counts.publish(this, 'topics.list', Topics.find(selector, options));

    //options.fields = Topics.publishedFields.list;

    const topics = Topics.find(selector, options);

    //let items = topics.fetch();
    //let first = items[0].name;
    //let count = items[0].statistic.postCount;

    return Users.canDo(currentUser, "topics.view.all") ? [topics] : [];

});

Meteor.publish('topics.suggestion', function (terms) {
    if (!!terms.query) {
        ({selector, options} = Topics.parameters.get(terms));

        // topicing this because of FR-SSR issue
        // Counts.publish(this, 'topics.list', Topics.find(selector, options));

        options.fields = Topics.publishedFields.list;

        const topics = Topics.find(selector, options);

        return [topics];
    }
    return [];
});






