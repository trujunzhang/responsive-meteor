import PoliticlHistory from './collection.js';
import PublicationsUtils from 'meteor/utilities:smart-publications';

PoliticlHistory.publishedFields = {};

/**
 * @summary Specify which fields should be published
 * @array PoliticlHistory.publishedFields.list
 */
PoliticlHistory.publishedFields.list = PublicationsUtils.arrayToFields([
  "_id",
  "url",
  "created_at",
  "post_id"
]);

/**
 * @summary Specify which fields should be published
 * @array PoliticlHistory.publishedFields.single
 */
PoliticlHistory.publishedFields.single = PublicationsUtils.arrayToFields(PoliticlHistory.getPublishedFields());