import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Topics from "meteor/nova:topics";
import {FormattedMessage, intlShape} from 'react-intl';
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';


class AppAdminTopics extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.topics.list",
            limit: 10
        };
        const {selector, options} = Topics.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Topics}
            publication="admin.topics.list"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={["allCount", "publishCount", "filterCount", "trashCount"]}
            component={Telescope.components.AppAdminTopicsList}
            counterNames={[Topics.getCounterKeyName()]}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }

    renderLeftPanel() {
        return (
          <Telescope.components.AppAdminTopicEditForm/>
        )

    }

    renderRightPanel() {
        const terms = {...this.props.location.query, listId: "admin.topics.list"};
        const {selector, options} = Topics.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={Topics}
            publication="admin.topics.list"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={["allCount"]}
            component={Telescope.components.AppAdminTopicsList}
            counterNames={[Topics.getCounterKeyName()]}
            listId={terms.listId}
            limit={10}
          />
        )

    }
}

AppAdminTopics.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    intl: intlShape
};

AppAdminTopics.displayName = "AppAdminTopics";

module.exports = withRouter(AppAdminTopics);
export default withRouter(AppAdminTopics);
