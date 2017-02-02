import PublicationUtils from 'meteor/utilities:smart-publications';
import Users from 'meteor/nova:users';
import Folders from "./collection.js";

Users.addField([
    /**
     * "telescope.folderBookmarkId" is the same as the user's "Read Later" _id.
     */
    {
        fieldName: "telescope.folderBookmarkId",
        fieldSchema: {
            type: String,
            optional: true,
            publish: true
        }
    },
    /**
     An array containing the `_id`s of folders
     */
    {
        fieldName: "telescope.folders",
        fieldSchema: {
            type: [String],
            optional: true,
            publish: true,
            join: {
                joinAs: "foldersArray",
                collection: () => Folders
            }
        }
    }
]);

PublicationUtils.addToFields(Users.publishedFields.list, [ "telescope.folders", "telescope.folderBookmarkId"]);
