import Users from 'meteor/nova:users';
import PoliticlHistory from '../collection.js';

import Posts from 'meteor/nova:posts';

const getHistoryListPosts = politiclCaches => {

    // add the postIds of each post authors
    let postIds = _.pluck(politiclCaches.fetch(), 'post_id');

    postIds = _.unique(postIds);

    return Posts.find({_id: {$in: postIds}}, {fields: Posts.publishedFields.list});
};

/**
 * @summary Publish a list of politiclHistory
 * @param {Object} terms
 */
Meteor.publish('app.history.admin', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = PoliticlHistory.parameters.get(terms));

    Counts.publish(this, 'tableCount', PoliticlHistory.find(selector, options), {noReady: true});

    Counts.publish(this, 'allCount', PoliticlHistory.find(), {noReady: true});
    Counts.publish(this, 'publishCount', PoliticlHistory.find(), {noReady: true});

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const politiclHistory = PoliticlHistory.find(selector, options);

    const posts = Tracker.nonreactive(function () {
        return getHistoryListPosts(politiclHistory);
    });

    return Users.canDo(currentUser, "politicl.history.view.all") ? [politiclHistory, posts] : [];

});






