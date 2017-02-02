import Users from 'meteor/nova:users';
import PoliticlCaches from '../collection.js';

import Posts from 'meteor/nova:posts';

const getCacheListPosts = politiclCaches => {

    // add the postIds of each post authors
    let postIds = _.pluck(politiclCaches.fetch(), 'post_id');

    postIds = _.unique(postIds);

    return Posts.find({_id: {$in: postIds}}, {fields: Posts.publishedFields.list});
};

/**
 * @summary Publish a list of politiclCaches
 * @param {Object} terms
 */
Meteor.publish('app.caches.admin', function (terms) {

    const currentUser = this.userId && Meteor.users.findOne(this.userId);

    terms.currentUserId = this.userId; // add currentUserId to terms
    ({selector, options} = PoliticlCaches.parameters.get(terms));

    Counts.publish(this, 'tableCount', PoliticlCaches.find(selector, options), {noReady: true});

    Counts.publish(this, 'allCount', PoliticlCaches.find(), {noReady: true});
    Counts.publish(this, 'publishCount', PoliticlCaches.find(), {noReady: true});

    if (!!terms.paged) {
        const limit = options.limit;
        options.skip = limit * (terms.paged - 1);
    }

    const politiclCaches = PoliticlCaches.find(selector, options);

    const posts = Tracker.nonreactive(function () {
        return getCacheListPosts(politiclCaches);
    });

    return Users.canDo(currentUser, "politicl.caches.view.all") ? [politiclCaches, posts] : [];

});






