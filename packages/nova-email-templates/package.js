Package.describe({
  name: "nova:email-templates",
  summary: "Telescope email templates package",
  version: "0.27.5-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.27.5-nova',
    'nova:posts@0.27.5-nova',
    'nova:users@0.27.5-nova',
    'nova:comments@0.27.5-nova',
    'nova:email@0.27.5-nova'
  ]);

  api.addFiles([
    'lib/emails.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/routes.js',
    'lib/server/templates.js'
  ], ['server']);

  api.addAssets([
      'lib/server/emails/common/test.handlebars',
      'lib/server/emails/common/wrapper.handlebars',
      'lib/server/emails/comments/newComment.handlebars',
      'lib/server/emails/comments/newReply.handlebars',
      'lib/server/emails/posts/newPendingPost.handlebars',
      'lib/server/emails/posts/newPost.handlebars',
      'lib/server/emails/posts/postApproved.handlebars',
      'lib/server/emails/posts/postRejected.handlebars',
      'lib/server/emails/posts/postRemoved.handlebars',
      'lib/server/emails/users/accountApproved.handlebars',
      'lib/server/emails/users/newUser.handlebars',
      'lib/server/emails/users/signupUser.handlebars',
      'lib/server/emails/users/removedUser.handlebars',
      "lib/server/emails/users/updatedUser.handlebars",
      "lib/server/emails/users/emailChangedUser.handlebars",
      "lib/server/emails/users/twitterConnectedUser.handlebars",
      "lib/server/emails/users/facebookConnectedUser.handlebars",
      "lib/server/emails/users/subscribedNewsLetterUser.handlebars",
      "lib/server/emails/users/unsubscribedNewsLetterUser.handlebars",
      'lib/server/emails/users/passwordless.handlebars',
      'lib/server/emails/users/inviteLetter.handlebars',
      'lib/server/emails/newsletter/newsletter.handlebars',
      'lib/server/emails/newsletter/newsletterConfirmation.handlebars',
      'lib/server/emails/newsletter/postItem.handlebars',
  ], ['server']);

});
