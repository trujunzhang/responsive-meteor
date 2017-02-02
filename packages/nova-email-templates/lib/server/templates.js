import NovaEmail from 'meteor/nova:email';

NovaEmail.addTemplates({
    test:                             Assets.getText("lib/server/emails/common/test.handlebars"),
    wrapper:                          Assets.getText("lib/server/emails/common/wrapper.handlebars"),
    newPost:                          Assets.getText("lib/server/emails/posts/newPost.handlebars"),
    newPendingPost:                   Assets.getText("lib/server/emails/posts/newPendingPost.handlebars"),
    postApproved:                     Assets.getText("lib/server/emails/posts/postApproved.handlebars"),
    postRejected:                     Assets.getText("lib/server/emails/posts/postRejected.handlebars"),
    postRemoved:                      Assets.getText("lib/server/emails/posts/postRemoved.handlebars"),
    newComment:                       Assets.getText("lib/server/emails/comments/newComment.handlebars"),
    newReply:                         Assets.getText("lib/server/emails/comments/newReply.handlebars"),
    accountApproved:                  Assets.getText("lib/server/emails/users/accountApproved.handlebars"),
    newUser:                          Assets.getText("lib/server/emails/users/newUser.handlebars"),
    signupUser:                       Assets.getText("lib/server/emails/users/signupUser.handlebars"),
    removedUser:                      Assets.getText("lib/server/emails/users/removedUser.handlebars"),
    updatedUser:                      Assets.getText("lib/server/emails/users/updatedUser.handlebars"),
    emailChangedUser:                 Assets.getText("lib/server/emails/users/emailChangedUser.handlebars"),
    twitterConnectedUser:             Assets.getText("lib/server/emails/users/twitterConnectedUser.handlebars"),
    facebookConnectedUser:            Assets.getText("lib/server/emails/users/facebookConnectedUser.handlebars"),
    subscribedNewsLetterUser:         Assets.getText("lib/server/emails/users/subscribedNewsLetterUser.handlebars"),
    unsubscribedNewsLetterUser:       Assets.getText("lib/server/emails/users/unsubscribedNewsLetterUser.handlebars"),
    passwordless:                     Assets.getText("lib/server/emails/users/passwordless.handlebars"),
    inviteLetter:                     Assets.getText("lib/server/emails/users/inviteLetter.handlebars"),
    newsletter:                       Assets.getText("lib/server/emails/newsletter/newsletter.handlebars"),
    newsletterConfirmation:           Assets.getText("lib/server/emails/newsletter/newsletterConfirmation.handlebars"),
    postItem:                         Assets.getText("lib/server/emails/newsletter/postItem.handlebars")
});
