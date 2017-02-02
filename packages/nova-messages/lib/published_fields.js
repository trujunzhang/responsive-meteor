import Messages from './collection.js'
import PublicationsUtils from 'meteor/utilities:smart-publications';

Messages.publishedFields = {};

/**
 * @summary Specify which fields should be published by the messages publication
 * @array Messages.publishedFields.list
 */
Messages.publishedFields.list = PublicationsUtils.arrayToFields([
    "_id",
    "message",
    "status",
    "type",
    "postId",
    "folderId",
    "commentId",
    "flag",
    "createdAt",
    "postedAt",
    "userId",
    "userIds",
    "readerIds",
    "isDeleted",
]);