import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Flags from "meteor/nova:flags";
import {withRouter} from 'react-router';

class AppAdminFlags extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.flags.list",
            limit: 10
        };
        const {selector, options} = Flags.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Flags}
            publication="app.flags.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={[
                "allCount",
                "tableCount"
            ]}
            joins={Flags.getJoins()}
            component={Telescope.components.AppAdminFlagsList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminFlags.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminFlags.displayName = "AppAdminFlags";

module.exports = withRouter(AppAdminFlags);
export default withRouter(AppAdminFlags);
