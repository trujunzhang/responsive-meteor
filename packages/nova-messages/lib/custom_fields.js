import PublicationUtils from 'meteor/utilities:smart-publications';
import Users from 'meteor/nova:users';
import Messages from "./collection.js";

Users.addField([
    /**
     An array containing the `_id`s of messages
     */
    {
        fieldName: "telescope.messages",
        fieldSchema: {
            type: [String],
            optional: true,
            publish: true,
            defaultValue: []
        }
    }
]);

PublicationUtils.addToFields(Users.publishedFields.list,
  [
      "telescope.messages",
  ]);
