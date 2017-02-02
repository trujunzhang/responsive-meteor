import {Meteor} from 'meteor/meteor';

let Facebook = Package.facebook.Facebook;
let Twitter = Package.twitter.Twitter;

/**
 *
 * @param credentialToken
 * @param callback
 * @param callName: like 'connectUserWithFacebook','connectUserWithTwitter'
 */
Accounts.oauth.tryConnectAfterPopupClosed = function (credentialToken, callback, callName) {
    let credentialSecret = OAuth._retrieveCredentialSecret(credentialToken) || null;
    Meteor.call("connectUserWith" + callName, credentialToken, credentialSecret, function () {
        if (!!callback) {
            callback(arguments);

            // Run async for connections.
            const user = Meteor.user();
            Telescope.callbacks.runAsync("users." + callName.toLowerCase() + ".connection.async", user);
        }
    });
};

Accounts.oauth.credentialRequestForConnectCompleteHandler = function (callback, callName) {
    return function (credentialTokenOrError) {
        if (credentialTokenOrError && credentialTokenOrError instanceof Error) {
            callback && callback(credentialTokenOrError);
        } else {
            // 'Facebook','Twitter'
            Accounts.oauth.tryConnectAfterPopupClosed(credentialTokenOrError, callback, callName);
        }
    };
};

Meteor.connectWithTwitter = function (options, callback) {
    // support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }

    let credentialRequestCompleteCallback = Accounts.oauth.credentialRequestForConnectCompleteHandler(callback, 'Twitter');
    Twitter.requestCredential(options, credentialRequestCompleteCallback);
};

Meteor.connectWithFacebook = function (options, callback) {
    // support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }

    let credentialRequestCompleteCallback = Accounts.oauth.credentialRequestForConnectCompleteHandler(callback, 'Facebook');
    Facebook.requestCredential(options, credentialRequestCompleteCallback);
};

