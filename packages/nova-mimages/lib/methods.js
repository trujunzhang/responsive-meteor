import Telescope from 'meteor/nova:lib';
import MeteorFiles from './meteor_files.js';
import Mimages from './collection.js';

/**
 *
 * Images Methods
 *
 */

MeteorFiles.on('afterUpload', fileRef => {
    //let url = Meteor.absoluteUrl((FlowRouter.current().path || document.location.pathname).replace(/^\//g, '')).split('?')[0].split('#')[0].replace('!', '');

    Mimages.createThumbnails(MeteorFiles, fileRef, function () {
        console.log(arguments);
    });
});

Meteor.methods({});

