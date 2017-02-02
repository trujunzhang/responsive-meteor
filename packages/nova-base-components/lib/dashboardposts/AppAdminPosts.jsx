import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';

class AppAdminPosts extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.posts.list",
            limit: 10
        };
        const {selector, options} = Posts.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Posts}
            publication="app.posts.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={[
                "allCount",
                "publishCount",
                "pendingCount",
                "rejectedCount",
                "draftCount",
                "trashCount",
                "tableCount"
            ]}
            joins={Posts.getJoins()}
            component={Telescope.components.AppAdminPostsList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminPosts.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminPosts.displayName = "AppAdminPosts";

module.exports = withRouter(AppAdminPosts);
export default withRouter(AppAdminPosts);
