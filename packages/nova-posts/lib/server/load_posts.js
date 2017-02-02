import Telescope from 'meteor/nova:lib';
import Posts from '../collection.js';

// Load system users from settings, if there are any

const STATUS_UI_ALERT_ID = "123456-654321";
let existingPost = Posts.findOne({_id: STATUS_UI_ALERT_ID});

// look for existing user with same slug
if (existingPost) {
    // if user exists, update it with settings data except slug
    //delete user.slug;
    //Users.update(existingPost._id, {$set: user});
} else {
    // if not, create it
    Posts.insert({
        _id: STATUS_UI_ALERT_ID,
        title: "No permission to view",
        status: Posts.config.STATUS_UI_ALERT
    });
    console.log(`// Creating default STATUS_UI_ALERT post`);// eslint-disable-line
}
