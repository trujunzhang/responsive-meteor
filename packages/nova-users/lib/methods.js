import Telescope from 'meteor/nova:lib';
import Users from './collection.js';

import NovaEmail from 'meteor/nova:email';
import {Accounts} from 'meteor/accounts-base';

let codes = new Meteor.Collection('meteor_accounts_passwordless');

/*
 var completeUserProfile = function (userId, modifier, user) {

 Users.update(userId, modifier);

 Telescope.callbacks.runAsync("users.profileCompleted.async", Users.findOne(userId));

 return Users.findOne(userId);

 };
 */

Users.methods = {};

/**
 * @summary Edit a user in the database
 * @param {string} userId – the ID of the user being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} user - the current user object
 */
Users.methods.edit = (userId, modifier, user) => {

    if (typeof user === "undefined") {
        user = Users.findOne(userId);
    }

    // ------------------------------ Callbacks ------------------------------ //

    modifier = Telescope.callbacks.run("users.edit.sync", modifier, user);

    // ------------------------------ Before Update ------------------------------ //
    const lastEmail = Users.getEmail(user);

    // ------------------------------ Update ------------------------------ //

    Users.update(userId, modifier);

    // ------------------------------ Callbacks ------------------------------ //

    Telescope.callbacks.runAsync("users.edit.async", Users.findOne(userId), user);

    // ------------------------------ After Update ------------------------------ //

    const newUser = Users.findOne(userId);
    if(Users.getEmail(newUser) !== lastEmail){
        Telescope.callbacks.runAsync("users.email.changed.async", Users.findOne(userId), user);
    }

    return newUser;

};

Users.methods.setSetting = (userId, settingName, value) => {
    // all settings should be in the user.telescope namespace, so add "telescope." if needed
    let field = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;

    let modifier = {$set: {}};
    modifier.$set[field] = value;

    Users.update(userId, modifier);
};

Users.methods.addGroup = (userId, groupName) => {
    Users.update(userId, {$push: {"telescope.groups": groupName}});
};

Users.methods.removeGroup = (userId, groupName) => {
    Users.update(userId, {$pull: {"telescope.groups": groupName}});
};


Users.methods.createUser = (options) => {
    // Unknown keys allowed, because a onCreateUserHook can take arbitrary
    // options.
    check(options, Match.ObjectIncluding({
        username: Match.Optional(String),
        email: Match.Optional(String),
    }));

    let username = options.username;
    let email = options.email;
    if (!username && !email)
        throw new Meteor.Error(400, "Need to set a username or email");

    let user = {services: {}};
    if (options.password) {
        let hashed = Accounts.hashPassword(options.password);
        user.services.password = {bcrypt: hashed};
    }

    if (username)
        user.username = username;
    if (email)
        user.emails = [{address: email, verified: false}];

    return Accounts.insertUserDoc(options, user);
};


Users.methods.verifyEmailToken = (token)=> {
    let validCode = codes.findOne({token: token});
    if (!validCode)
        throw new Meteor.Error('Unknown email');

    const selector = validCode['email'];

    let user;
    let email;
    if (selector.indexOf('@') === -1) {
        user = Meteor.users.findOne({username: selector});
        if (!user) throw new Meteor.Error('Username ' + selector + ' doesn\'t exists, create an accounts first or login with the email');
        if (!user.emails || user.emails.length < 1) throw new Meteor.Error('No email attached to user ' + selector);
        email = user.emails[0].address;
    } else {
        user = Meteor.users.findOne({'emails.address': selector});
        email = selector;
    }

    let now = new Date().getTime() / 1000;
    let timeToWait;

    if (validCode.lastTry) {
        timeToWait = validCode.lastTry.getTime() / 1000 + Math.pow(validCode.nbTry, 2);

        if (timeToWait > now)
            throw new Meteor.Error('You must wait ' + Math.ceil(timeToWait - now) + ' seconds');
    }

    if (validCode.token !== token) {
        codes.update({email: email}, {$set: {lastTry: new Date()}, $inc: {nbTry: 1}});
        throw new Meteor.Error('Invalid verification code');
    }
    // Clear the verification code after a succesful login.
    //codes.remove({email: email});

    const password = email.split('').reverse().join('');

    let uid;
    if (user) {
        uid = user._id;
    }
    //else {
    //    uid = Users.methods.createUser({username: '', email: email, password: password});
    //    user = Meteor.users.findOne(uid);
    //    console.log('created user', uid, user);
    //}

    //if (user) {
    //    // Set the email as verified since he validated the code with this email
    //    let ve = _.find(user.emails, function (e) {
    //        return e.address === email;
    //    });
    //    if (ve && !ve.verified) {
    //        // By including the address in the query, we can use 'emails.$' in the
    //        // modifier to get a reference to the specific object in the emails
    //        // array. See
    //        // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)
    //        // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull
    //        Meteor.users.update({_id: uid, 'emails.address': email}, {$set: {'emails.$.verified': true}});
    //    }
    //}
    return {userId: uid, email: email, password: password};
};

Users.methods.sendVerificationCode = (selector, options)=> {
    let email;
    let user;
    if (selector.indexOf('@') === -1) {
        user = Meteor.users.findOne({username: selector});
        if (!user) throw new Meteor.Error('Username \'' + selector + '\' doesn\'t exists, enter your email address to create your account instead of your username.');
        if (!user.emails || user.emails.length < 1) throw new Meteor.Error('No email attached to user ' + selector);
        email = user.emails[0].address;
    } else {
        user = Users.findByEmail(selector);
        // If the user doesn't exists, we'll create it when the user will verify his email
        email = selector;
    }

    if (!!user) {
        throw new Meteor.Error('email already registered!');
    }

    // Generate a 16 character alpha-numeric token:
    let token = RandToken.generate(12);

    // Generate a new token
    codes.upsert({email: email}, {$set: {token: token}});

    let subject = "Welcome to Politicl";
    let properties = {
        passwordlessLink: Telescope.utils.getSiteUrl() + "/users/callback/email?token=" + token,
    };
    let result = NovaEmail.buildAndSend(email, subject, 'passwordless', properties);

    return result;
};

Users.methods.sendInviteLetter = (selector, user)=> {
    let email = selector;
    const display = Users.getDisplayName(user);

    let subject = "Welcome to Politicl";
    let properties = {
        sender: display,
        inviteLink: Telescope.utils.getSiteUrl()
    };
    let result = NovaEmail.buildAndSend(email, subject, 'inviteLetter', properties);

    return result;
};


Meteor.methods({
    'users.edit'(userId, modifier) {

        // checking might be redundant because SimpleSchema already enforces the schema, but you never know
        //check(modifier, Match.OneOf({$set: Users.simpleSchema()}, {$unset: Object}, {$set: Users.simpleSchema(), $unset: Object}));
        Users.simpleSchema().namedContext("users.edit").validate(modifier, {modifier: true});
        check(userId, String);

        let currentUser = Meteor.user(),
          user = Users.findOne(userId),
          schema = Users.simpleSchema()._schema;

        // ------------------------------ Checks ------------------------------ //

        // check that user can edit document
        if (!user || !Users.canEdit(currentUser, user)) {
            throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_user');
        }

        // go over each field and throw an error if it's not editable
        // loop over each operation ($set, $unset, etc.)
        _.each(modifier, function (operation) {
            // loop over each property being operated on
            _.keys(operation).forEach(function (fieldName) {

                let field = schema[fieldName];
                if (!Users.canEditField(currentUser, field, user)) {
                    throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
                }

            });
        });

        return Users.methods.edit(userId, modifier, user);

    },


    // ------------------------------ (RemoveUsersMethod) ------------------------------ //
    'users.remove'(userId, options) {

        // do the user which to delete his account or another user?
        const actionType = this.userId === userId ? "own" : "all";

        if (Users.canDo(Meteor.user(), `users.remove.${actionType}`)) {

            const user = Users.findOne(userId);

            Users.remove(userId);
            options = {
                deleteComments : true,
                deletePosts : true,
                deleteFolders : true,
                deleteMessages : true
            };

            Telescope.callbacks.runAsync("users.remove.async", user, options);
        }
    },

    'users.setSetting'(userId, settingName, value) {

        check(userId, String);
        check(settingName, String);
        check(value, Match.OneOf(String, Number, Boolean));

        let currentUser = Meteor.user(),
          user = Users.findOne(userId);

        // check that user can edit document
        if (!user || !Users.canEdit(currentUser, user)) {
            throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_user');
        }

        Users.methods.setSetting(userId, settingName, value);

    },

    'signin.passwordless.with.email': function (selector, options) {

        check(selector, String);

        return Users.methods.sendVerificationCode(selector, options);
    },

    'invite.with.email': function (selector) {

        check(selector, String);

        let currentUser = Meteor.user();

        return Users.methods.sendInviteLetter(selector, currentUser);
    },

    'verification.email.token': function (token) {
        check(token, String);
        return Users.methods.verifyEmailToken(token);
    }

});
