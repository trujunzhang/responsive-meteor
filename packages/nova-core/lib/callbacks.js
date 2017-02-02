import Telescope from 'meteor/nova:lib';

let modifyKarma = function (userId, karma) {
  Meteor.users.update({_id: userId}, {$inc: {"telescope.karma": karma}});
};

/**
 * @summary Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
function updateScore (item, user, collection, operation) {
  Telescope.updateScore({collection: collection, item: item, forceUpdate: true});
}
Telescope.callbacks.add("posts.upvote.async", updateScore);
Telescope.callbacks.add("posts.downvote.async", updateScore);
Telescope.callbacks.add("posts.cancelUpvote.async", updateScore);
Telescope.callbacks.add("posts.cancelDownvote.async", updateScore);

/**
 * @summary Update the profile of the user doing the operation
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
function updateUser (item, user, collection, operation) {

  let update = {};
  let votePower = Telescope.getVotePower(user);
  let vote = {
    itemId: item._id,
    votedAt: new Date(),
    power: votePower
  };

  switch (operation) {
    case "upvote":
      update.$addToSet = {'telescope.upvotedPosts': vote};
      break;
    case "downvote":
      update.$addToSet = {'telescope.downvotedPosts': vote};
      break;
    case "cancelUpvote": 
      update.$pull = {'telescope.upvotedPosts': {itemId: item._id}};
      break;
    case "cancelDownvote": 
      update.$pull = {'telescope.downvotedPosts': {itemId: item._id}};
      break;
  }

  Meteor.users.update({_id: user._id}, update);

}
Telescope.callbacks.add("posts.upvote.async", updateUser);
Telescope.callbacks.add("posts.downvote.async", updateUser);
Telescope.callbacks.add("posts.cancelUpvote.async", updateUser);
Telescope.callbacks.add("posts.cancelDownvote.async", updateUser);

/**
 * @summary Update the karma of the item's owner
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
function updateKarma (item, user, collection, operation) {

  let votePower = Telescope.getVotePower(user);
  let karmaAmount = (operation === "upvote" || operation === "cancelDownvote") ? votePower : -votePower;
  
  // only update karma is the operation isn't done by the item's author
  if (item.userId !== user._id) {
    Meteor.users.update({_id: item.userId}, {$inc: {"telescope.karma": karmaAmount}});
  }

}
Telescope.callbacks.add("posts.upvote.async", updateKarma);
Telescope.callbacks.add("posts.downvote.async", updateKarma);
Telescope.callbacks.add("posts.cancelUpvote.async", updateKarma);
Telescope.callbacks.add("posts.cancelDownvote.async", updateKarma);