import Telescope from 'meteor/nova:lib';
import marked from 'marked';
import Topics from './collection.js';
import Users from 'meteor/nova:users';

//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/*

 ### topics.new.method

 - TopicsNewUserCheck
 - TopicsNewRateLimit
 - TopicsNewSubmittedPropertiesCheck

 ### topics.new.sync

 - TopicsNewRequiredPropertiesCheck

 ### topics.new.async

 - TopicsNewOperations
 - TopicsNewUpvoteOwnTopic
 - TopicsNewNotifications

 ### topics.edit.method

 - TopicsEditUserCheck
 - TopicsEditSubmittedPropertiesCheck

 ### topics.edit.sync

 ### topics.edit.async

 ### users.remove.async

 - UsersRemoveDeleteTopics

 */

// ------------------------------------- topics.new.sync -------------------------------- //

// ------------------------------------- topics.new.async -------------------------------- //

// ------------------------------------- topics.edit.method -------------------------------- //

// ------------------------------------- topics.edit.sync -------------------------------- //

// ------------------------------------- topics.edit.async -------------------------------- //

