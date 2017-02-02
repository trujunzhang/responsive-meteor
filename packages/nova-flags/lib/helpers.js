import Telescope from 'meteor/nova:lib';
import Users from "meteor/nova:users";
import Flags from "./collection.js";

Flags.helpers({getCollection: () => Flags});
Flags.helpers({getCollectionName: () => "flags"});
/**
 * @summary Get all of a post's flags
 * @param {Object} user
 */
Users.getFlags = function (user) {
  return !!user.flags ? Flags.find({_id: {$in: user.flags}}).fetch() : [];
};
Users.helpers({getFlags: function () {return Users.getFlags(this);}});

/**
 * @summary Get a flag's URL
 * @param {Object} flag
 * @param isAbsolute
 */
Flags.getUrl = function (flag, isAbsolute) {
  isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return `${prefix}/?cat=${flag.slug}`;
};
Flags.helpers({getUrl: function () {return Flags.getUrl(this);}});

/**
 * @summary Get a flag's counter name
 * @param {Object} flag
 */
 Flags.getCounterName = function (flag) {
  return flag._id + "-flagsCount";
 };
 Flags.helpers({getCounterName: function () {return Flags.getCounterName(this);}});

