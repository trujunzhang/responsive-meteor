import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';

class AppAdminComments extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.comments.list",
            limit: 10
        };
        const {selector, options} = Comments.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Comments}
            publication="app.comments.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={[
                "allCount",
                "pendingCount",
                "publishCount",
                "spamCount",
                "trashCount",
                "tableCount"
            ]}
            counterNames={["approvedCount","unapprovedCount"]}
            joins={Comments.getJoins()}
            component={Telescope.components.AppAdminCommentsList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminComments.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminComments.displayName = "AppAdminComments";

module.exports = withRouter(AppAdminComments);
export default withRouter(AppAdminComments);
