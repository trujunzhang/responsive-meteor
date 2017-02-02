import PoliticlCaches from './collection.js';
import PublicationsUtils from 'meteor/utilities:smart-publications';

PoliticlCaches.publishedFields = {};

/**
 * @summary Specify which fields should be published
 * @array PoliticlCaches.publishedFields.list
 */
PoliticlCaches.publishedFields.list = PublicationsUtils.arrayToFields([
    "_id",
    "url",
    "created_at",
    "thumbnail_url",
    "url_from",
    "post_id"
]);

/**
 * @summary Specify which fields should be published
 * @array PoliticlCaches.publishedFields.single
 */
PoliticlCaches.publishedFields.single = PublicationsUtils.arrayToFields(PoliticlCaches.getPublishedFields());