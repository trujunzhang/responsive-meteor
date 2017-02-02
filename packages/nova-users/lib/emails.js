import Users from './collection.js';
import NovaEmail from 'meteor/nova:email';

const getUser = (userId) => {
    return typeof Users.findOne(userId) === "undefined" ? Users.findOne() : Users.findOne(userId);
};

NovaEmail.addEmails({
    signupUser: {
        template: "signupUser",
        path: "/email/new-user/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Welcome to Politicl";
        },
        getTestObject: getUser
    },

    newUser: {
        template: "newUser",
        path: "/email/new-user/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "A new user has been created";
        },
        getTestObject: getUser
    },

    removedUser: {
        template: "removedUser",
        path: "/email/remove-user/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Politicl Account Deleted";
        },
        getTestObject: getUser
    },

    forgotPasswordUser: {
        template: "forgotPasswordUser",
        path: "/email/forgot-password-user/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Forgot Your Password on Politicl?";
        },
        getTestObject: getUser
    },

    accountApproved: {
        template: "accountApproved",
        path: "/email/account-approved/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Your account has been approved.";
        },
        getTestObject: getUser
    },

    updatedUser: {
        template: "updatedUser",
        path: "/email/account-updatedUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Politicl Account Details Updated";
        },
        getTestObject: getUser
    },

    emailChangedUser: {
        template: "emailChangedUser",
        path: "/email/account-emailChangedUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Politicl Email Updated";
        },
        getTestObject: getUser
    },

    twitterConnectedUser: {
        template: "twitterConnectedUser",
        path: "/email/account-twitterConnectedUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Twitter Account Connected with Politicl";
        },
        getTestObject: getUser
    },

    facebookConnectedUser: {
        template: "facebookConnectedUser",
        path: "/email/account-facebookConnectedUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Facebook Account Connected with Politicl";
        },
        getTestObject: getUser
    },

    subscribedNewsLetterUser: {
        template: "subscribedNewsLetterUser",
        path: "/email/account-subscribedNewsLetterUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Your account has been subscribed the politicl's newsletter.";
        },
        getTestObject: getUser
    },

    unsubscribedNewsLetterUser: {
        template: "unsubscribedNewsLetterUser",
        path: "/email/account-unsubscribedNewsLetterUser/:_id?",
        getProperties: Users.getNotificationProperties,
        subject() {
            return "Your account has been unsubscribed the politicl's newsletter.";
        },
        getTestObject: getUser
    }

});
