import Users from 'meteor/nova:users';

const anonymousActions = [
    "posts.view.approved.own",
    "posts.view.approved.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "validate.submitted.post.link",
    "posts.view.approved.own",
    "posts.view.approved.all",
    "posts.view.pending.own",
    "posts.view.rejected.own",
    "posts.view.spam.own",
    "posts.view.deleted.own",
    "posts.new",
    "posts.edit.own",
    "posts.remove.own",
    "posts.upvote",
    "posts.cancelUpvote",
    "posts.downvote",
    "posts.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
    "posts.view.pending.all",
    "posts.view.approved.all",
    "posts.view.rejected.all",
    "posts.view.spam.all",
    "posts.view.deleted.all",
    "posts.view.flagged.all",
    "posts.view.pending.own",
    "posts.view.approved.own",
    "posts.view.rejected.own",
    "posts.view.spam.own",
    "posts.view.deleted.own",
    "posts.view.flagged.own",
    "posts.status.approved",
    "posts.edit.all",
    "posts.remove.all",
    "admin.manager.all"
];
Users.groups.admins.can(adminActions);
