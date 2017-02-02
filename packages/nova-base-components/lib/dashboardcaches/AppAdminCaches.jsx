import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import PoliticlCaches from "meteor/nova:politicl-caches";
import {withRouter} from 'react-router';

class AppAdminCaches extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.caches.list",
            limit: 10
        };
        const {selector, options} = PoliticlCaches.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={PoliticlCaches}
            publication="app.caches.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={[
                "allCount",
                "publishCount",
                "tableCount"
            ]}
            joins={PoliticlCaches.getJoins()}
            component={Telescope.components.AppAdminCachesList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminCaches.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCaches.displayName = "AppAdminCaches";

module.exports = withRouter(AppAdminCaches);
export default withRouter(AppAdminCaches);
