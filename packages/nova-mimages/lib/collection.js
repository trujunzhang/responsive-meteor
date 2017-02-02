import MeteorFiles from './meteor_files.js';

/* we need to handle two scenarios: when the package is called as a Meteor package,
 and when it's called as a NPM package */

const Mimages = MeteorFiles.collection;

export default Mimages;
