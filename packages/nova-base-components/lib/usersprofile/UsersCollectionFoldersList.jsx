import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Folders from "meteor/nova:folders";

const UsersCollectionFoldersList = (props, context) => {
    const user = props.user; // Important: <* props.user (Maybe user is not Logged user)*>

    const folders = user.telescope.folders;
    const foldersCount = (folders && folders.length > 0) ? folders.length : 0;

    const terms = {
        view: 'best',
        userId: user._id,
        listId: "user.profile.collection.folder.list",
        limit: 10
    };
    const {selector, options} = Folders.parameters.get(terms);

    return (
      <Telescope.components.NewsListContainer
        collection={Folders}
        publication="folders.list"
        selector={selector}
        options={options}
        terms={terms}
        joins={Folders.getJoins()}
        component={Telescope.components.FoldersList}
        componentProps={
            {
                title: foldersCount + " Collections Made",
                emptyHint: "No collections yet.",
                user:user
            }
                       }
        listId={terms.listId}
        limit={terms.limit}
      />
    )
};

UsersCollectionFoldersList.displayName = "UsersCollectionFoldersList";

module.exports = UsersCollectionFoldersList;
