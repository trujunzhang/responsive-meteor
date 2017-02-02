import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Button } from 'react-bootstrap';

const UsersAccountMenuBase = () => {

    return (
      <Dropdown id="accounts-dropdown" className="users-account-menu">
          <Dropdown.Toggle>
              <FormattedMessage id="users.log_in"/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
              <Telescope.components.UsersAccountForm />
          </Dropdown.Menu>
      </Dropdown>
    )
};

UsersAccountMenuBase.displayName = "UsersAccountMenuBase";

module.exports = UsersAccountMenuBase;
export default UsersAccountMenuBase;