import Users from 'meteor/nova:users';

/**
 * @summary Publish a list of politiclHistory
 * @param {Object} terms
 */
Meteor.publish('app.scrapyd.admin', function (terms) {

    return Users.canDo(currentUser, "politicl.scrapyd.view.all") ? [] : [];

});






