import Telescope from 'meteor/nova:lib';
import Flags from "./collection.js";

// generate slug on insert
Flags.before.insert(function (userId, doc) {
    // if no slug has been provided, generate one
    let slug = !!doc.slug ? doc.slug : Telescope.utils.slugify(doc.name);
    //doc.slug = Telescope.utils.getUnusedSlug(Flags, slug);
    // Here, we allow the same slugs with other flags.
    doc.slug = slug;
});

// generate slug on edit, if it has changed
Flags.before.update(function (userId, doc, fieldNames, modifier) {
    if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== doc.slug) {
        modifier.$set.slug = Telescope.utils.getUnusedSlug(Flags, modifier.$set.slug);
    }
});

// ------------------------------------- flags.new.method -------------------------------- //

function FlagsNewUserCheck(flag, user) {
    // check that user can post
    if (!user || !Users.canDo(user, "flags.new"))
        throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_post_new_flags');
    return flag;
}
Telescope.callbacks.add("flags.new.method", FlagsNewUserCheck);

function FlagsNewSubmittedPropertiesCheck(flag, user) {
    // admin-only properties
    // userId
    const schema = Flags.simpleSchema()._schema;

    // clear restricted properties
    //_.keys(flag).forEach(function (fieldName) {
    //
    //    // make an exception for postId, which should be setable but not modifiable
    //    if (fieldName === "postId") {
    //        // ok
    //    } else {
    //        let field = schema[fieldName];
    //        if (!Users.canSubmitField (user, field)) {
    //            throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
    //        }
    //    }
    //
    //});

    // if no userId has been set, default to current user id
    if (!flag.userId) {
        flag.userId = user._id;
    }
    return flag;
}
Telescope.callbacks.add("flags.new.method", FlagsNewSubmittedPropertiesCheck);

// ------------------------------------- flags.new.sync -------------------------------- //

/**
 * @summary Check for required properties
 */
function FlagsNewRequiredPropertiesCheck(flag, user) {

    let userId = flag.userId; // at this stage, a userId is expected

    // Don't allow empty flags
    if (!flag.reason)
        throw new Meteor.Error(704, 'your_reason_is_empty');

    let defaultProperties = {
        createdAt: new Date(),
        postedAt: new Date()
    };

    flag = _.extend(defaultProperties, flag);

    return flag;
}
Telescope.callbacks.add("flags.new.sync", FlagsNewRequiredPropertiesCheck);



// ------------------------------------- flags.new.async -------------------------------- //

function operationPostStatus(flag, user) {

    const userId = flag.userId; // at this stage, a userId is expected

    const postId =flag.postId;

    Posts.update(postId, {
        $set: {
            status: Posts.config.STATUS_REJECTED
        }
    });

    return flag;
}
Telescope.callbacks.add("flags.new.async", operationPostStatus);

function removedPostsFlaggers(posts) {
    _.forEach(posts, function (post) {
        Flags.remove({postId: post._id});
    });
}
Telescope.callbacks.add("posts.delete.permanently.async", removedPostsFlaggers);
