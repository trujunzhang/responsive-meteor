import Telescope from 'meteor/nova:lib';
import Users from './collection.js';

Users.getNotificationProperties = function (user) {
    const properties = {
        profileUrl: Users.getProfileUrl(user, true),
        displayName: Users.getDisplayName(user),
        siteTitle: Telescope.settings.get('title'),
        siteUrl: Telescope.utils.getSiteUrl()
    };
    return properties;
};
