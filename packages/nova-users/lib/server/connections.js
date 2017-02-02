// OVERRIDE CORE METHOD for custom twitter user selection on email
// this can be removed when the pull-request is merged
// https://github.com/meteor/meteor/pull/2318

import {Meteor} from 'meteor/meteor';
import Telescope from 'meteor/nova:lib';

let Facebook = Package.facebook.Facebook;
let Twitter = Package.twitter.Twitter;

///
/// OAuth Encryption Support
///

let OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption;

let usingOAuthEncryption = function () {
    return OAuthEncryption && OAuthEncryption.keyIsLoaded();
};

// OAuth service data is temporarily stored in the pending credentials
// collection during the oauth authentication process.  Sensitive data
// such as access tokens are encrypted without the user id because
// we don't know the user id yet.  We re-encrypt these fields with the
// user id included when storing the service data permanently in
// the users collection.
//
let pinEncryptedFieldsToUser = function (serviceData, userId) {
    _.each(_.keys(serviceData), function (key) {
        let value = serviceData[key];
        if (OAuthEncryption && OAuthEncryption.isSealed(value))
            value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
        serviceData[key] = value;
    });
};

Accounts.externalServiceSelector = function (serviceName, serviceData, options) {
    let selector = false;

    //check if specific selector is available for service
    //eg externalServiceSelectorTwitter
    let selectorMethod = "externalServiceSelector";
    selectorMethod += serviceName.charAt(0).toUpperCase() + serviceName.slice(1);

    if (Accounts[selectorMethod]) {
        selector = Accounts[selectorMethod](serviceName, serviceData, options);
    }

    // Look for a user with the appropriate service user id.
    if (!selector && !!serviceData.id) {
        let serviceIdKey = "services." + serviceName + ".id";
        selector[serviceIdKey] = serviceData.id;
    }

    return selector;
};

Accounts.externalServiceSelectorTwitter = function (serviceName, serviceData, options) {
    let selector = {};
    // XXX Temporary special case for Twitter. (Issue #629)
    //   The serviceData.id will be a string representation of an integer.
    //   We want it to match either a stored string or int representation.
    //   This is to cater to earlier versions of Meteor storing twitter
    //   user IDs in number form, and recent versions storing them as strings.
    //   This can be removed once migration technology is in place, and twitter
    //   users stored with integer IDs have been migrated to string IDs.
    if (!isNaN(serviceData.id)) {
        selector["$or"] = [{}, {}];
        selector["$or"][0][serviceIdKey] = serviceData.id;
        selector["$or"][1][serviceIdKey] = parseInt(serviceData.id, 10);
    } else {
        selector = false;
    }
    return selector;
};

/// this must remain in this package after pull request merge

//our custom twitter selector to also select users on twitter-email
Accounts.externalServiceSelectorTwitter = function (serviceName, serviceData, options) {
    let serviceIdKey = "services." + serviceName + ".id";
    let selector = {};
    selector["$or"] = [{}, {}];
    selector["$or"][0][serviceIdKey] = serviceData.id;
    //also check on email
    selector["$or"][1]["emails.address"] = serviceData.email;
    if (!serviceData.email)
        selector = false;
    return selector;
};

///
/// MANAGING USER OBJECTS
///

// Updates or creates a user after we authenticate with a 3rd party.
//
// @param serviceName {String} Service name (eg, twitter).
// @param serviceData {Object} Data to store in the user's record
//        under services[serviceName]. Must include an "id" field
//        which is a unique identifier for the user in the service.
// @param options {Object, optional} Other options to pass to insertUserDoc
//        (eg, profile)
// @returns {Object} Object with token and id keys, like the result
//        of the "login" method.
//
Accounts.updateOrCreateUserFromExternalService = function (serviceName, serviceData, options) {
    options = _.clone(options || {});

    if (serviceName === "password" || serviceName === "resume")
        throw new Error(
          "Can't use updateOrCreateUserFromExternalService with internal service "
          + serviceName);
    if (!_.has(serviceData, 'id'))
        throw new Error(
          "Service data for service " + serviceName + " must include id");

    let selector = Accounts.externalServiceSelector(serviceName, serviceData, options);

    if (!selector)
        return false;

    let user = Meteor.users.findOne(selector);

    if (user) {
        pinEncryptedFieldsToUser(serviceData, user._id);

        // We *don't* process options (eg, profile) for update, but we do replace
        // the serviceData (eg, so that we keep an unexpired access token and
        // don't cache old email addresses in serviceData.email).
        // XXX provide an onUpdateUser hook which would let apps update
        //     the profile too
        let setAttrs = {};
        _.each(serviceData, function (value, key) {
            setAttrs["services." + serviceName + "." + key] = value;
        });

        // XXX Maybe we should re-use the selector above and notice if the update
        //     touches nothing?
        Meteor.users.update(user._id, {$set: setAttrs});
        return {
            type: serviceName,
            userId: user._id
        };
    } else {
        // Create a new user with the service data. Pass other options through to
        // insertUserDoc.
        user = {services: {}};
        user.services[serviceName] = serviceData;
        return {
            type: serviceName,
            userId: Accounts.insertUserDoc(options, user)
        };
    }
};

Accounts.externalServiceSelectorTwitter = function (serviceName, serviceData, options) {
    let serviceIdKey = "services." + serviceName + ".id";
    let selector = {};
    // XXX Temporary special case for Twitter. (Issue #629)
    //   The serviceData.id will be a string representation of an integer.
    //   We want it to match either a stored string or int representation.
    //   This is to cater to earlier versions of Meteor storing twitter
    //   user IDs in number form, and recent versions storing them as strings.
    //   This can be removed once migration technology is in place, and twitter
    //   users stored with integer IDs have been migrated to string IDs.
    if (!isNaN(serviceData.id)) {
        selector["$or"] = [{}, {}];
        selector["$or"][0][serviceIdKey] = serviceData.id;
        selector["$or"][1][serviceIdKey] = parseInt(serviceData.id, 10);
    } else {
        selector = false;
    }
    return selector;
};

/// this must remain in this package after pull request merge

//our custom facebook selector to also select users on facebook-email
Accounts.externalServiceSelectorFacebook = function (serviceName, serviceData, options) {
    let serviceIdKey = "services." + serviceName + ".id";
    let selector = {};
    selector["$or"] = [{}, {}];
    selector["$or"][0][serviceIdKey] = serviceData.id;
    //also check on email
    selector["$or"][1]["emails.address"] = serviceData.email;
    if (!serviceData.email)
        selector = false;
    return selector;
};

Meteor.methods({
    connectUserWithTwitter: function (token, secret) {
        //errors
        if (!this.userId)
            throw new Meteor.Error(403, "user must be loggedin");

        let user = Meteor.user();
        if (user.services && user.services.twitter)
            throw new Meteor.Error(403, "user can not have a twitter connected account");

        if (Meteor.isServer) {
            let tData = Twitter.retrieveCredential(token, secret);

            if (!tData)
                throw new Meteor.Error(403, "not able to retreive fb data");

            //check if no accounts exists for this twitter user
            let existing = Meteor.users.find({'services.twitter.id': tData.serviceData.id}).count();
            if (existing)
                throw new Meteor.Error(403, "Your twitter have been connected by other account");

            console.log("twitter:" + tData.serviceData);

            Meteor.users.update({_id: this.userId}, {$set: {'services.twitter': tData.serviceData}});

            Telescope.callbacks.runAsync("users.twitter.connection.async", user);
        }
    },

    connectUserWithFacebook: function (token, secret) {
        //errors
        if (!this.userId)
            throw new Meteor.Error(403, "user must be loggedin");

        let user = Meteor.user();
        if (user.services && user.services.facebook)
            throw new Meteor.Error(403, "user can not have a facebook connected account");

        if (Meteor.isServer) {
            let fbData = Facebook.retrieveCredential(token, secret);

            if (!fbData)
                throw new Meteor.Error(403, "not able to retreive fb data");

            //check if no accounts exists for this facebook user
            let existing = Meteor.users.find({'services.facebook.id': fbData.serviceData.id}).count();
            if (existing)
                throw new Meteor.Error(403, "Your facebook have been connected by other account");

            console.log("facebook:" + fbData.serviceData);

            Meteor.users.update({_id: this.userId}, {$set: {'services.facebook': fbData.serviceData}});

            Telescope.callbacks.runAsync("users.facebook.connection.async", user);
        }
    },

    'users.disconnect.service': function (service) {
        if (!this.userId)
            throw new Meteor.Error(403, "user must be loggedin");

        let user = Meteor.user();

        if (!user.services || !user.services[service])
            throw new Meteor.Error(403, "user can not have a " + service + " connected account");

        if (Meteor.isServer) {
            const unsetObj = {};
            unsetObj['services.' + service] = {};
            Meteor.users.update({_id: this.userId}, {$unset: unsetObj});
        }
    },
});

