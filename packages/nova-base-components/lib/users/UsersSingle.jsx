import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

const UsersSingle = (props, context) => {
    const terms = {"telescope.slug": props.params.slug};
    const path = props.location.pathname;
    return (
      //Important: Using <*PostDocumentContainer*> here.
        <Telescope.components.PostDocumentContainer
        key={path}
        collection={Users}
        publication="users.profile"
        selector={terms}
        terms={terms}
        component={Telescope.components.UsersProfile}
        componentProps={{children: props.children}}
        documentPropName="user"
      />
    )
};

UsersSingle.displayName = "UsersSingle";

module.exports = UsersSingle;
