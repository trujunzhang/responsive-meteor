import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import PoliticlHistory from "meteor/nova:politicl-history";
import {withRouter} from 'react-router';

class AppAdminHistory extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.history.list",
            limit: 10
        };
        const {selector, options} = PoliticlHistory.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={PoliticlHistory}
            publication="app.history.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={["allCount", "publishCount", "tableCount"]}
            joins={PoliticlHistory.getJoins()}
            component={Telescope.components.AppAdminHistoryList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminHistory.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminHistory.displayName = "AppAdminHistory";

module.exports = withRouter(AppAdminHistory);
export default withRouter(AppAdminHistory);
