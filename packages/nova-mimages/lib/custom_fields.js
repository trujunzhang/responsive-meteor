import PublicationUtils from 'meteor/utilities:smart-publications';
import Users from 'meteor/nova:users';

import Mimages from './collection.js';

// check if user can create a new user
const canInsert = user => Users.canDo(user, "users.new");

// check if user can edit a user
const canEdit = Users.canEdit;

// check if user can edit *all* users
const canEditAll = user => Users.canDo(user, "users.edit.all");

Users.addField([
    /**
     An array containing the `_id`s of messages
     */
    {
        fieldName: "telescope.coverId",
        fieldSchema: {
            type: String,
            optional: true,
            publish: true,
            defaultValue: '',
            insertableIf: canInsert,
            editableIf: canEdit,
            join: {
                joinAs: "cover",
                collection: () => Mimages
            }
        }
    }
]);

PublicationUtils.addToFields(Users.publishedFields.list,
  [
      "telescope.coverId",
  ]);
