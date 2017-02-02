import Users from 'meteor/nova:users';

const anonymousActions = [];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "messages.view.approved.all",
    "messages.view.all",
    "messages.new",
];
Users.groups.default.can(defaultActions);

const adminActions = [
    "messages.edit.all",
    "messages.remove.all"
];
Users.groups.admins.can(adminActions);
