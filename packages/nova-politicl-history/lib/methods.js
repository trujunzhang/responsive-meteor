import Telescope from 'meteor/nova:lib';
import PoliticlHistory from './collection.js';
import Users from 'meteor/nova:users';

PoliticlHistory.methods = {};
// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Topic ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Meteor.methods({

    'politicl.history.delete': function (historyIds) {

        check(historyIds, Array);

        if (Users.isAdmin(Meteor.user())) {
            const _history = [];
            PoliticlHistory.find({_id: {$in: historyIds}}).forEach(function (history) {
                _history.push(history);
                // delete history
                PoliticlHistory.remove(history._id);
            });

            Telescope.callbacks.runAsync("politiclHistoryDeleteAsync", _history);

        } else {
            //Messages.flash('You need to be an admin to do that.', "error");
        }
    },

});
