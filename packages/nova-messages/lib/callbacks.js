import Telescope from 'meteor/nova:lib';
import Messages from "./collection.js";
import Folders from "meteor/nova:folders";
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Flags from "meteor/nova:flags";

// generate slug on insert
Messages.before.insert(function (userId, doc) {
    // if no slug has been provided, generate one
    let slug = !!doc.slug ? doc.slug : Telescope.utils.slugify(doc.name);
    //doc.slug = Telescope.utils.getUnusedSlug(Messages, slug);
    // Here, we allow the same slugs with other messages.
    doc.slug = slug;
});

// generate slug on edit, if it has changed
Messages.before.update(function (userId, doc, fieldNames, modifier) {
    if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== doc.slug) {
        modifier.$set.slug = Telescope.utils.getUnusedSlug(Messages, modifier.$set.slug);
    }
});

// ------------------------------------- messages.new.method -------------------------------- //

function MessagesNewUserCheck(message, user) {
    // check that user can post
    if (!user || !Users.canDo(user, "messages.new"))
        throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_post_new_messages');
    return message;
}
Telescope.callbacks.add("messages.new.method", MessagesNewUserCheck);

// ------------------------------------- messages.new.async -------------------------------- //

/**
 * @summary Check for required properties
 */
function MessagesNewRequiredPropertiesCheck(message, user) {

    let userId = message.userId; // at this stage, a userId is expected

    // Don't allow empty messages
    if (message.type === Messages.config.TYPE_FLAGED_POST || message.type === Messages.config.TYPE_FLAGED_COMMENT) {
        if (!message.message)
            throw new Meteor.Error(704, 'your_reason_is_empty');
    }

    let defaultProperties = {
        createdAt: new Date(),
        postedAt: new Date()
    };

    message = _.extend(defaultProperties, message);

    return message;
}
Telescope.callbacks.add("messages.new.sync", MessagesNewRequiredPropertiesCheck);

function addMessagesCountUser(message) {
    message.userIds.forEach(function (userId) {
        // increment message count
        Meteor.users.update({_id: userId}, {
            $addToSet: {'telescope.messages': message._id}
        });
    });
}
Telescope.callbacks.add("messages.new.async", addMessagesCountUser);

function decreaseMessagesCountUser(message, user) {
    Meteor.users.update({_id: user._id}, {
        $pull: {'telescope.messages': message._id}
    });
}
Telescope.callbacks.add("messages.add.reader.async", decreaseMessagesCountUser);

// ------------------------------------- generate messages when XXX.async -------------------------------- //
function submitPostMessage(post) {
    Messages.methods.new(
      {
          userId: post.userId,
          userIds: [post.userId],
          message: post.title,
          type: Messages.config.TYPE_ARTICLE_SUBMITTED,
          postId: post._id
      }
    );
}
Telescope.callbacks.add("posts.new.async", submitPostMessage);

function postApprovedMessage(post) {
    Messages.methods.new(
      {
          userId: post.userId,
          userIds: [post.userId],
          message: post.title,
          type: Messages.config.TYPE_ARTICLE_APPROVED,
          postId: post._id
      }
    );
}
Telescope.callbacks.add("posts.approve.async", postApprovedMessage);

function postRemovedMessage(posts) {
    _.forEach(posts, function (post) {
        Messages.methods.new(
          {
              userId: post.userId,
              userIds: [post.userId],
              message: post.title,
              type: Messages.config.TYPE_ARTICLE_REMOVED,
              postId: post._id
          }
        );
    });
}
Telescope.callbacks.add("posts.delete.permanently.async", postRemovedMessage);

function postRejectedMessage(flag, user) {
    // The article you submitted "<Article Title>" has been rejected.
    if (flag.type === Flags.config.TYPE_POST) {
        Messages.methods.new(
          {
              userId: flag.authorId,
              userIds: [flag.userId, flag.authorId],
              message: Posts.findOne(flag.postId).title,
              type: Messages.config.TYPE_ARTICLE_REJECTED,
              postId: flag.postId
          }
        );
    }
}
Telescope.callbacks.add("flags.new.async", postRejectedMessage);

/**
 * When creating a new folder with a post.
 * Here, we need to add two messages.
 * one is 'Collection Created', other is 'Article Saved in Collection'.
 */
function newFolderMessage(folder, oldFolder) {
    // one is 'Collection Created'

    // Ignoring it when creating a new default folder after sign up.
    if (folder.name !== Folders.getDefaultFolderName()) {
        Messages.methods.new(
          {
              userId: folder.userId,
              userIds: [folder.userId],
              folderId: folder._id,
              type: Messages.config.TYPE_FOLDER_CREATED,
              postId: oldFolder.lastPost
          }
        );
    }
}
Telescope.callbacks.add("folders.new.async", newFolderMessage);

function insertNewFolderMessage(folder, oldFolder) {
    // Ignoring it when creating a new default folder after sign up.
    if (folder.name !== Folders.getDefaultFolderName()) {
        Messages.methods.new(
          {
              userId: folder.userId,
              userIds: [folder.userId],
              folderId: folder._id,
              message: Posts.findOne(oldFolder.lastPost).title,
              type: Messages.config.TYPE_ARTICLE_TO_FOLDER,
              postId: oldFolder.lastPost
          }
        );
    }
}
Telescope.callbacks.add("folders.new.async", insertNewFolderMessage);

function insertFolderMessage(folder, oldFolder) {
    Messages.methods.new(
      {
          userId: folder.userId,
          userIds: [folder.userId],
          folderId: folder._id,
          message: Posts.findOne(oldFolder.lastPost).title,
          type: Messages.config.TYPE_ARTICLE_TO_FOLDER,
          postId: oldFolder.lastPost
      }
    );
}

Telescope.callbacks.add("folders.insert.post.async", insertFolderMessage);

/**
 * Cleanup the messages type contains 'folders.new.async' and 'folders.insert.post.async'.
 */
function cleanupFolderMessage(folder) {
    let deletedMessages = Messages.remove(
      {
          folderId: folder._id,
          type: {$in: [Messages.config.TYPE_FOLDER_CREATED, Messages.config.TYPE_ARTICLE_TO_FOLDER]}
      }
    );
}
Telescope.callbacks.add("folders.remove.async", cleanupFolderMessage);

function deleteFolderMessage(folder) {
    const message = {
        userId: folder.userId,
        userIds: [folder.userId],
        message: folder.name,
        type: Messages.config.TYPE_FOLDER_REMOVED
    };
    Messages.methods.new(message);
}
Telescope.callbacks.add("folders.remove.async", deleteFolderMessage);

function commentPostedMessage(comment) {
    Messages.methods.new(
      {
          userId: comment.userId,
          userIds: [comment.userId],
          commentId: comment._id,
          message: Posts.findOne(comment.postId).title,
          postId: comment.postId,
          type: Messages.config.TYPE_COMMENT_POSTED
      }
    );
}
Telescope.callbacks.add("comments.new.async", commentPostedMessage);

function newsLetterAddUserMessage(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_NEWSLETTER_ADD_USER
      }
    );
}
Telescope.callbacks.add("newsletter.addUser.async", newsLetterAddUserMessage);

function newsLetterRemoveUserMessage(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_NEWSLETTER_REMOVE_USER
      }
    );
}
Telescope.callbacks.add("newsletter.removeUser.async", newsLetterRemoveUserMessage);

function commentsUpvotedMessage(item, user) {
    if (!!Users.findOne(item.userId)) {
        Messages.methods.new(
          {
              userId: item.userId,
              userIds: [item.userId],
              commentId: item._id,
              message: Posts.findOne(item.postId).title,
              postId: item.postId,
              type: Messages.config.TYPE_COMMENT_VOTE_UP
          }
        );
    }
}
Telescope.callbacks.add("comments.upvote.async", commentsUpvotedMessage);

function commentsDownvotedMessage(item, user) {
    if (!!Users.findOne(item.userId)) {
        Messages.methods.new(
          {
              userId: item.userId,
              userIds: [item.userId],
              commentId: item._id,
              message: Posts.findOne(item.postId).title,
              postId: item.postId,
              type: Messages.config.TYPE_COMMENT_VOTE_DOWN
          }
        );
    }
}
Telescope.callbacks.add("comments.downvote.async", commentsDownvotedMessage);

function addUserSignup(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_USER_SIGN_UP
      }
    );
}
//Telescope.callbacks.add("users.new.async", addUserSignup);

function usersEditMessage(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_USER_EDIT
      }
    );
}
Telescope.callbacks.add("users.edit.async", usersEditMessage);

function usersEmailChangedMessage(newUser, user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_USER_EMAIL_CHANGED
      }
    );
}
Telescope.callbacks.add("users.email.changed.async", usersEmailChangedMessage);

function usersTwitterConnectedMessage(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_USER_TWITTER_CONNECTED
      }
    );
}
Telescope.callbacks.add("users.twitter.connection.async", usersTwitterConnectedMessage);

function usersFacebookConnectedMessage(user) {
    Messages.methods.new(
      {
          userId: user._id,
          userIds: [user._id],
          type: Messages.config.TYPE_USER_FACEBOOK_CONNECTED
      }
    );
}
Telescope.callbacks.add("users.facebook.connection.async", usersFacebookConnectedMessage);

// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeleteMessages(user, options) {
    if (options && options.deleteMessages) {
        Messages.remove({userId: user._id});
    } else {
        // not sure if anything should be done in that scenario yet
        // Comments.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
    }
}
Telescope.callbacks.add("users.remove.async", UsersRemoveDeleteMessages);






