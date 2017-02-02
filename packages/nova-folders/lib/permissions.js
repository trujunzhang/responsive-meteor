import Users from 'meteor/nova:users';

const anonymousActions = [
    "folders.view.approved.all",
];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "folders.view.approved.all",
    "folders.insertPost",
    "folders.removePost",
    "folders.view.all",
    "folders.new",
    "folders.edit.own",
    "folders.remove.own"
];
Users.groups.default.can(defaultActions);

const adminActions = [];
Users.groups.admins.can(adminActions);
