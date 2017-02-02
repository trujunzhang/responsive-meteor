import Telescope from 'meteor/nova:lib';
import Folders from "../collection.js";
import Posts from 'meteor/nova:posts';
import Users from 'meteor/nova:users';

// Load system users from settings, if there are any

if (Meteor.settings && Meteor.settings.systemUsers) {
    Meteor.settings.systemUsers.forEach(user => {
        let existingUser = Users.findOne({_id: user._id});

        if (!existingUser) {
            switch (user.loginType) {
                case Users.config.TYPE_TWITTER:
                    existingUser = Users.findOne({"services.twitter.id": user.services.twitter.id});
                    break;
                case Users.config.TYPE_FACEBOOK:
                    existingUser = Users.findOne({"services.facebook.id": user.services.facebook.id});
                    break;
            }
        }

        // look for existing user with same slug
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
