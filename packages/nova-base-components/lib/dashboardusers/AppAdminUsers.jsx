import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

class AppAdminUsers extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {...this.props.location.query, listId: "admin.users.list"};
        const {selector, options} = Users.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Users}
            publication="app.users.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={[
                "tablePostCount",
                "adminCount",
                "twitterCount",
                "facebookCount",
                "passwordlessCount"
            ]}
            joins={Users.getJoins()}
            counterNames={[Users.getCounterKeyName()]}
            component={Telescope.components.AppAdminUsersList}
            listId={terms.listId}
            limit={10}
          />
        )

    }
}

AppAdminUsers.displayName = "AppAdminUsers";

module.exports = withRouter(AppAdminUsers);
export default withRouter(AppAdminUsers);
