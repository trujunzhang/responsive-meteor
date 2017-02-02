import Telescope from 'meteor/nova:lib';
import { Kadira } from 'meteor/meteorhacks:kadira';

Meteor.startup(function () {
    var kadiraAppId = Telescope.settings.get('KADIRA_APP_ID');
    var kadiraAppSecret = Telescope.settings.get('KADIRA_APP_SECRET');
    if (process.env.NODE_ENV === "production" && !!kadiraAppId && !!kadiraAppSecret) {
        Kadira.connect(kadiraAppId, kadiraAppSecret);
    }
});
