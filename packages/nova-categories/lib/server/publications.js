import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "../collection.js";

Meteor.publish('categories', function () {

    const currentUser = this.userId && Users.findOne(this.userId);

    if (Users.canDo(currentUser, "posts.view.approved.all")) {

        let categories = Categories.find({}, {fields: Categories.publishedFields.list});
        let publication = this;

        categories.forEach(function (category) {
            let childrenCategories = category.getChildren();
            let categoryIds = [category._id].concat(_.pluck(childrenCategories, "_id"));
            let cursor = Posts.find({$and: [{categories: {$in: categoryIds}}]});
            Counts.publish(publication, category.getCounterName(), cursor, {noReady: true});
        });

        return categories;
    }
    return [];
});