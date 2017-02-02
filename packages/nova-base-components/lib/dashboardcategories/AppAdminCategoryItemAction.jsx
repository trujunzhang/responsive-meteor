import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import moment from 'moment';
import {withRouter} from 'react-router';


class AppAdminCategoryItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.category);
    }

    renderRowAction() {
        return (
          <div className="row-actions">
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "quick_edit")}>Quick Edit</a>
              </span>
          </div>
        )
    }

    render() {
        return (
          <div>{this.renderRowAction()}</div>
        )
    }

}

AppAdminCategoryItemAction.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

AppAdminCategoryItemAction.displayName = "AppAdminCategoryItemAction";

module.exports = withRouter(AppAdminCategoryItemAction);
export default withRouter(AppAdminCategoryItemAction);
