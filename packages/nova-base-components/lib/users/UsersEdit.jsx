import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';

const UsersEdit = (props, context) => {

    const {user,currentUser} = props;

    const children = (<Telescope.components.UsersEditForm user={currentUser}/>);

    return (
      <Telescope.components.CanDo
        action="users.edit"
        document={user}
        displayNoPermissionMessage={true}
      >
          {children}
      </Telescope.components.CanDo>
    )
};

UsersEdit.propTypes = {
    user: React.PropTypes.object.isRequired,
};

UsersEdit.contextTypes = {
    messages: React.PropTypes.object,
    intl: intlShape
};

UsersEdit.displayName = "UsersEdit";

module.exports = UsersEdit;
export default UsersEdit;
