import Telescope from 'meteor/nova:lib';
import Users from "../collection.js";

// Load system users from settings, if there are any

if (Meteor.settings && Meteor.settings.systemUsers) {
    Meteor.settings.systemUsers.forEach(user => {

        const userId = user._id;

        // look for existing user with same slug
        let existingUser = Users.findOne({_id: user._id});

        if (existingUser) {
            // if user exists, update it with settings data except slug
            //delete user.slug;
            //Users.update(existingUser._id, {$set: user});
        } else {
            // if not, create it
            Users.insert(user);
            console.log(`// Creating system user “${user.telescope.displayName}”`);// eslint-disable-line
        }
    });
}
