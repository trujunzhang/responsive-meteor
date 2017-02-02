import Users from 'meteor/nova:users';

const anonymousActions = [
    "topics.view.own",
    "topics.view.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "topics.view.own",
    "topics.view.all",
    "topics.new",
    "topics.edit.own",
    "topics.remove.own",
    "topics.upvote",
    "topics.cancelUpvote",
    "topics.downvote",
    "topics.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
    "topics.edit.all",
    "topics.remove.all",
    "admin.topics.view.all"
];
Users.groups.admins.can(adminActions);