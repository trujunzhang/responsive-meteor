import Users from 'meteor/nova:users';

const anonymousActions = [
    "politicl.caches.view.own",
    "politicl.caches.view.all"
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "politicl.caches.view.own",
    "politicl.caches.view.all",
    "politicl.caches.new",
    "politicl.caches.edit.own",
    "politicl.caches.remove.own",
    "politicl.caches.upvote",
    "politicl.caches.cancelUpvote",
    "politicl.caches.downvote",
    "politicl.caches.cancelDownvote"
];
Users.groups.default.can(defaultActions);

const adminActions = [
    "politicl.caches.edit.all",
    "politicl.caches.remove.all",
    "admin.politicl.caches.view.all"
];
Users.groups.admins.can(adminActions);