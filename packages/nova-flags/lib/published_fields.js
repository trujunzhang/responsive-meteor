import Flags from './collection.js'
import PublicationsUtils from 'meteor/utilities:smart-publications';

Flags.publishedFields = {};

/**
 * @summary Specify which fields should be published by the flags publication
 * @array Flags.publishedFields.list
 */
Flags.publishedFields.list = PublicationsUtils.arrayToFields([
    "_id",
    "reason",
    "status",
    "type",
    "postId",
    "createdAt",
    "postedAt",
    "userId",
    "authorId",
    "isDeleted",
]);