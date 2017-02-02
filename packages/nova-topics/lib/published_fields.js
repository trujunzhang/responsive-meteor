import Topics from './collection.js';
import PublicationsUtils from 'meteor/utilities:smart-publications';

Topics.publishedFields = {};

/**
 * @summary Specify which fields should be published
 * @array Topics.publishedFields.list
 */
Topics.publishedFields.list = PublicationsUtils.arrayToFields([
  "_id",
  "name",
  "slug",
]);

/**
 * @summary Specify which fields should be published
 * @array Topics.publishedFields.single
 */
Topics.publishedFields.single = PublicationsUtils.arrayToFields(Topics.getPublishedFields());