import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Folders from 'meteor/nova:folders';

const UsersFolder = (props, context) => {

    const terms = props.params.cid ? {"_id": props.params.cid} : undefined;

    return (
       //Important: Using <*PostDocumentContainer*> here.
      <Telescope.components.PostDocumentContainer
        collection={Folders}
        publication="folders.single"
        selector={terms}
        terms={terms}
        documentPropName="folder"
        component={Telescope.components.UsersFolderProfile}
        joins={Folders.getJoins()}
      />
    )
};

UsersFolder.displayName = "UsersFolder";

module.exports = UsersFolder;
