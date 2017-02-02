import Telescope from 'meteor/nova:lib';
import Events from "meteor/nova:events";
import NovaEmail from 'meteor/nova:email';
import {Gravatar} from 'meteor/jparker:gravatar';
import marked from 'marked';
import Users from './collection.js';

//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * @summary Generate HTML body from Markdown on user bio insert
 */
Users.after.insert(function (userId, user) {

    // run create user async callbacks
    Telescope.callbacks.runAsync("users.new.async", user);

    if (user.loginType === Users.config.TYPE_TWITTER) {
        Telescope.callbacks.runAsync("users.twitter.connection.async", user);
    } else if (user.loginType === Users.config.TYPE_FACEBOOK) {
        Telescope.callbacks.runAsync("users.facebook.connection.async", user);
    }

    // check if all required fields have been filled in. If so, run profile completion callbacks
    if (Users.hasCompletedProfile(user)) {
        Telescope.callbacks.runAsync("users.profileCompleted.async", user);
    }

});

/**
 * @summary Generate HTML body from Markdown when user bio is updated
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
    // if bio is being modified, update htmlBio too
    if (Meteor.isServer && modifier.$set && modifier.$set["telescope.bio"]) {
        modifier.$set["telescope.htmlBio"] = Telescope.utils.sanitize(marked(modifier.$set["telescope.bio"]));
    }
});

/**
 * @summary Disallow $rename
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
    if (!!modifier.$rename) {
        throw new Meteor.Error("illegal $rename operator detected!");
    }
});

/**
 * @summary If user.telescope.email has changed, check for existing emails and change user.emails and email hash if needed
 */
if (Meteor.isServer) {
    Users.before.update(function (userId, doc, fieldNames, modifier) {

        let user = doc;

        // if email is being modified, update user.emails too
        if (Meteor.isServer && modifier.$set && modifier.$set["telescope.email"]) {

            let newEmail = modifier.$set["telescope.email"];

            // check for existing emails and throw error if necessary
            let userWithSameEmail = Users.findByEmail(newEmail);
            if (userWithSameEmail && userWithSameEmail._id !== doc._id) {
                throw new Meteor.Error("email_taken2", "this_email_is_already_taken" + " (" + newEmail + ")");
            }

            // if user.emails exists, change it too
            if (!!user.emails) {
                user.emails[0].address = newEmail;
                modifier.$set.emails = user.emails;
            }

            // update email hash
            modifier.$set["telescope.emailHash"] = Gravatar.hash(newEmail);

        }
    });
}

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/**
 * @summary Set up user object on creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function setupUser(user, options) {
    // ------------------------------ Properties ------------------------------ //
    let userProperties = {
        profile: options.profile || {},
        telescope: {
            karma: 0,
            isInvited: false,
            postCount: 0,
            commentCount: 0,
            invitedCount: 0,
            upvotedPosts: [],
            downvotedPosts: [],
            upvotedComments: [],
            downvotedComments: []
        }
    };
    user = _.extend(user, userProperties);

    user.loginType = Users.config.TYPE_PASSWORDLESS;
    if (user.services.facebook) {
        user.loginType = Users.config.TYPE_FACEBOOK;
    } else if (user.services.github) {
        user.loginType = Users.config.TYPE_GITHUB;
    } else if (user.services.google) {
        user.loginType = Users.config.TYPE_GOOGLE;
    } else if (user.services.linkedin) {
        user.loginType = Users.config.TYPE_LINKEDIN;
    } else if (user.services.twitter) {
        user.loginType = Users.config.TYPE_TWITTER;
    }

    // look in a few places for the user email
    if (options.email) {
        user.telescope.email = options.email;
    } else if (user.services['meteor-developer'] && user.services['meteor-developer'].emails) {
        user.telescope.email = _.findWhere(user.services['meteor-developer'].emails, {primary: true}).address;
    } else if (user.services.facebook && user.services.facebook.email) {
        user.telescope.email = user.services.facebook.email;
    } else if (user.services.github && user.services.github.email) {
        user.telescope.email = user.services.github.email;
    } else if (user.services.google && user.services.google.email) {
        user.telescope.email = user.services.google.email;
    } else if (user.services.linkedin && user.services.linkedin.emailAddress) {
        user.telescope.email = user.services.linkedin.emailAddress;
    } else if (user.services.twitter && user.services.twitter.email) {
        user.telescope.email = user.services.twitter.email;
    }

    // generate email hash
    if (!!user.telescope.email) {
        user.telescope.emailHash = Gravatar.hash(user.telescope.email);
    }

    // look in a few places for the displayName
    if (user.profile.username) {
        user.telescope.displayName = user.profile.username;
    } else if (user.profile.name) {
        user.telescope.displayName = user.profile.name;
    } else if (user.services.linkedin && user.services.linkedin.firstName) {
        user.telescope.displayName = user.services.linkedin.firstName + " " + user.services.linkedin.lastName;
    } else {
        user.telescope.displayName = user.username;
    }

    // create a basic slug from display name and then modify it if this slugs already exists;
    const basicSlug = Telescope.utils.slugify(user.telescope.displayName);
    user.telescope.slug = Telescope.utils.getUnusedSlug(Users, basicSlug);

    // if this is not a dummy account, and is the first user ever, make them an admin
    user.isAdmin = (!user.profile.isDummy && Users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

    Events.track('new user', {username: user.telescope.displayName, email: user.telescope.email});

    return user;
}
Telescope.callbacks.add("users.new.sync", setupUser);

function hasCompletedProfile(user) {
    return Users.hasCompletedProfile(user);
}
Telescope.callbacks.add("users.profileCompleted.sync", hasCompletedProfile);

function adminUserCreationNotification(user) {
    // send notifications to admins
    const admins = Users.adminUsers();
    admins.forEach(function (admin) {
        if (Users.getSetting(admin, "notifications_users", false)) {
            //const emailProperties = Users.getNotificationProperties(user);
            //const html = NovaEmail.getTemplate('newUser')(emailProperties);
            //////////////////NovaEmail.send(Users.getEmail(admin), `New user account: ${emailProperties.displayName}`, NovaEmail.buildTemplate(html));
        }
    });
    return user;
}
//Telescope.callbacks.add("users.new.sync", adminUserCreationNotification);

function signupUserEmailNotification(user) {
    // send notifications to admins
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'signupUser', user);
        }
    }
    return user;
}
Telescope.callbacks.add("users.new.async", signupUserEmailNotification);

function updatedUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'updatedUser', user);
        }
    }
    return user;
}

Telescope.callbacks.add("users.edit.async", updatedUserEmailNotification);

function removedUserEmailNotification(user) {
    if (Meteor.isServer) {
        Telescope.notifications.create(user._id, 'removedUser', user);
    }
    return user;
}
Telescope.callbacks.add("users.remove.async", removedUserEmailNotification);

function emailChangedUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'emailChangedUser', user);
        }
    }
    return user;
}
Telescope.callbacks.add("users.email.changed.async", emailChangedUserEmailNotification);

function twitterChangedUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'twitterConnectedUser', user);
        }
    }
    return user;
}

Telescope.callbacks.add("users.twitter.connection.async", twitterChangedUserEmailNotification);

function facebookChangedUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'facebookConnectedUser', user);
        }
    }
    return user;
}

Telescope.callbacks.add("users.facebook.connection.async", facebookChangedUserEmailNotification);

function subscribedNewsLetterUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'subscribedNewsLetterUser', user);
        }
    }
    return user;
}

Telescope.callbacks.add("newsletter.addUser.async", subscribedNewsLetterUserEmailNotification);

function unsubscribedNewsLetterUserEmailNotification(user) {
    if (!user.isAdmin) {
        if (Meteor.isServer) {
            Telescope.notifications.create(user._id, 'unsubscribedNewsLetterUser', user);
        }
    }
    return user;
}

Telescope.callbacks.add("newsletter.removeUser.async", unsubscribedNewsLetterUserEmailNotification);
