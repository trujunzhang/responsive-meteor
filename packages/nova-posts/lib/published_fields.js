import Posts from './collection.js'
import PublicationsUtils from 'meteor/utilities:smart-publications';

Posts.publishedFields = {};

/**
 * @summary Specify which fields should be published by the posts.list publication
 * @array Posts.publishedFields.list
 */
Posts.publishedFields.list = PublicationsUtils.arrayToFields([
    "_id",
    "createdAt",
    "postedAt",
    "url",
    "title",
    "body",
    "slug",
    "excerpt",
    "viewCount",
    "lastCommentedAt",
    "clickCount",
    "baseScore",
    "score",
    "status",
    "sticky",
    "author",
    "topics",
    "cloudinaryId",
    "userId",
    "upvotes", "upvoters", "downvotes", "downvoters"
]);

/**
 * @summary Specify which fields should be published by the posts.single publication
 * @array Posts.publishedFields.single
 */
Meteor.startup(() => {
    Posts.publishedFields.single = PublicationsUtils.arrayToFields(Posts.getPublishedFields());
});