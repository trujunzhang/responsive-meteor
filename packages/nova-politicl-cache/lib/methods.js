import Telescope from 'meteor/nova:lib';
import PoliticlCaches from './collection.js';
import Users from 'meteor/nova:users';

PoliticlCaches.methods = {};
// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Topic ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Meteor.methods({

    'politicl.caches.delete': function (cacheIds) {

        check(cacheIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _caches = [];
            PoliticlCaches.find({_id: {$in: cacheIds}}).forEach(function (cache) {
                _caches.push(cache);
                // delete cache
                PoliticlCaches.remove(cache._id);
            });

            Telescope.callbacks.runAsync("politiclCachesDeleteAsync", _caches);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

});
