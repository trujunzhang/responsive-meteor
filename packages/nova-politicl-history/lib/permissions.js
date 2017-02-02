import Users from 'meteor/nova:users';

const anonymousActions = [
    "politicl.history.view.own",
    "politicl.history.view.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "politicl.history.view.own",
    "politicl.history.view.all",
    "politicl.history.new",
    "politicl.history.edit.own",
    "politicl.history.remove.own",
    "politicl.history.upvote",
    "politicl.history.cancelUpvote",
    "politicl.history.downvote",
    "politicl.history.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
    "politicl.history.edit.all",
    "politicl.history.remove.all",
    "admin.politicl.history.view.all"
];
Users.groups.admins.can(adminActions);