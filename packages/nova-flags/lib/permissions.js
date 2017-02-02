import Users from 'meteor/nova:users';

const anonymousActions = [];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    "flags.view.approved.all",
    "flags.view.all",
    "flags.new",
    "flags.edit.all",
    "flags.remove.all"
];
Users.groups.default.can(defaultActions);

const adminActions = [];
Users.groups.admins.can(adminActions);
