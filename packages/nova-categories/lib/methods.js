import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "./collection.js";
import {Messages} from 'meteor/nova:core';

Categories.methods = {};

Categories.methods.edit = function (categoryId, modifier, category) {

    if (typeof category === "undefined") {
        category = Categories.findOne(categoryId);
    }

    modifier = Telescope.callbacks.run("categories.edit.sync", modifier, category);

    Categories.update(categoryId, modifier);

    Telescope.callbacks.runAsync("categories.edit.async", Categories.findOne(categoryId), category);

    return Categories.findOne(categoryId);
};

Meteor.methods({
    "categories.deleteById": function (categoryId) {

        check(categoryId, String);

        const currentUser = this.userId && Users.findOne(this.userId);

        if (Users.canDo(currentUser, "categories.remove.all")) {

            // delete category
            Categories.remove(categoryId);

            // find any direct children of this category and make them root categories
            Categories.find({parentId: categoryId}).forEach(function (category) {
                Categories.update(category._id, {$unset: {parentId: ""}});
            });

            // find any posts with this category and remove it
            let postsUpdated = Posts.update({categories: {$in: [categoryId]}}, {$pull: {categories: categoryId}}, {multi: true});

            return postsUpdated;

        }
    },

    "categories.submit.new": function (category) {

        check(category, Object);

        const currentUser = this.userId && Users.findOne(this.userId);

        if (Users.canDo(currentUser, "categories.submit.new")) {

            category._id = Categories.insert(category);

            return category;
        }
    },

    'categories.bulk.edit': function (categoryIds, modifier) {

        check(categoryIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _categories = [];
            Categories.find({_id: {$in: categoryIds}}).forEach(function (category) {
                _categories.push(category);
                let update = {};
                if (!!modifier.name && !!modifier.slug) {
                    update['name'] = modifier.name;
                    update['slug'] = modifier.slug;
                }
                Categories.update(category._id, {$set: update});
            });

            Telescope.callbacks.runAsync("categories.bulk.edit.async", _categories);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },
    'categories.admin.edit': function (categoryId, modifier) {

        Categories.simpleSchema().namedContext("categories.admin.edit").validate(modifier, {modifier: true});
        check(categoryId, String);

        const currentUser = this.userId && Users.findOne(this.userId);

        if (Users.canDo(currentUser, "categories.admin.edit")) {

            const category = Categories.findOne(categoryId);

            modifier = Telescope.callbacks.run("categories.edit.method", modifier, category, Meteor.user());

            return Categories.methods.edit(categoryId, modifier, category);
        }
    },

});

Categories.smartMethods({
    createName: "categories.new",
    //editName: "categories.edit"
});