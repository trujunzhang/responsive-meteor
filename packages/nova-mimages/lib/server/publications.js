import Users from 'meteor/nova:users';
import Images from "../collection.js";

Meteor.publish('images', function () {

    const currentUser = this.userId && Users.findOne(this.userId);

    return [];
});

/**
 * @summary Publish a list of images, along with the users corresponding to these images
 * @param {Object} terms
 */
Meteor.publish('images.list', function (terms) {

    // this.unblock(); // causes bug where publication returns 0 results

    this.autorun(function () {

        const currentUser = this.userId && Meteor.users.findOne(this.userId);

        terms.currentUserId = this.userId; // add currentUserId to terms
        const {selector, options} = Images.parameters.get(terms);

        const images = Images.find(selector, options);

        // note: doesn't work yet :(
        // CursorCounts.set(terms, images.count(), this.connection.id);

        return Users.canDo(currentUser, "images.view.approved.all") ? [images] : [];
    });

});

