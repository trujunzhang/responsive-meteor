import Users from 'meteor/nova:users';

const anonymousActions = [];
Users.groups.anonymous.can(anonymousActions);

const defaultActions = [
    //"images.view.approved.all",
    //"images.view.all",
    //"images.new",
    //"images.edit.all",
    //"images.remove.all"
];
Users.groups.default.can(defaultActions);

const adminActions = [];
Users.groups.admins.can(adminActions);
