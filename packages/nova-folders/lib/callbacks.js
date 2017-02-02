import Telescope from 'meteor/nova:lib';
import Folders from "./collection.js";

// generate slug on insert
Folders.before.insert(function (userId, doc) {
    // if no slug has been provided, generate one
    let slug = !!doc.slug ? doc.slug : Telescope.utils.slugify(doc.name);
    //doc.slug = Telescope.utils.getUnusedSlug(Folders, slug);
    // Here, we allow the same slugs with other folders.
    doc.slug = slug;
});

// generate slug on edit, if it has changed
Folders.before.update(function (userId, doc, fieldNames, modifier) {
    if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== doc.slug) {
        modifier.$set.slug = Telescope.utils.getUnusedSlug(Folders, modifier.$set.slug);
    }
});

// ------------------------------------- folders.new.method -------------------------------- //

function FoldersNewUserCheck(folder, user) {
    // check that user can post
    if (!user || !Users.canDo(user, "folders.new"))
        throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_post_new_folders');
    return folder;
}
Telescope.callbacks.add("folders.new.method", FoldersNewUserCheck);

function FoldersNewSubmittedPropertiesCheck(folder, user) {
    // admin-only properties
    // userId
    const schema = Folders.simpleSchema()._schema;

    // clear restricted properties
    //_.keys(folder).forEach(function (fieldName) {
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
    if (!folder.userId) {
        folder.userId = user._id;
    }
    return folder;
}
Telescope.callbacks.add("folders.new.method", FoldersNewSubmittedPropertiesCheck);

// ------------------------------------- folders.new.async -------------------------------- //

/**
 * @summary Check for required properties
 */
function FoldersNewRequiredPropertiesCheck(folder, user) {

    let userId = folder.userId; // at this stage, a userId is expected

    // Don't allow empty folders
    if (!folder.name)
        throw new Meteor.Error(704, 'your_name_is_empty');

    let defaultProperties = {
        createdAt: new Date(),
        postedAt: new Date(),
    };

    folder = _.extend(defaultProperties, folder);

    return folder;
}
Telescope.callbacks.add("folders.new.sync", FoldersNewRequiredPropertiesCheck);

function FoldersNewOperations(folder) {

    let userId = folder.userId;
    let folderId = folder._id;

    const update = {
        $addToSet: {'telescope.folders': folderId}
    };

    if (folder.name === Folders.getDefaultFolderName()) {
        update["$set"] = {"telescope.folderBookmarkId": folderId};
    }

    // increment folder count
    Meteor.users.update({_id: userId}, update);

    return folder;
}
Telescope.callbacks.add("folders.new.async", FoldersNewOperations);

function FoldersRemoveUsersOperations(folder) {

    let userId = folder.userId;
    let folderId = folder._id;

    // increment folder count
    Meteor.users.update({_id: userId}, {
        $pull: {'telescope.folders': folderId}
    });

    return folder;
}
Telescope.callbacks.add("folders.remove.async", FoldersRemoveUsersOperations);

function FolderDefaultOperations(user) {
    return Folders.methods.new({
        name: Folders.getDefaultFolderName(),
        userId: user._id,
        visible: "Lock"
    });
}
Telescope.callbacks.add("users.new.async", FolderDefaultOperations);

// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeleteFolders(user, options) {
    if (options && options.deleteFolders) {
        let deletedFolders = Folders.remove({userId: user._id});
    } else {
        // not sure if anything should be done in that scenario yet
        // Folders.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
    }
}
Telescope.callbacks.add("users.remove.async", UsersRemoveDeleteFolders);

