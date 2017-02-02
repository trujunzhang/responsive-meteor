import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminTopicItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.topic);
    }

    renderRowAction() {
        return (
          <div className="row-actions">
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "quick_edit")}>Quick Edit</a>
                  |
              </span>
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "filter")}>Filter in trending</a>
                  |
              </span>
              <span className="trash">
                  <a onClick={this.onActionApplyClick.bind(this, "trash")} className="submitdelete">Trash</a>
              </span>
          </div>
        )
    }

    renderRowActionForFilter() {
        return (
          <div className="row-actions">
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "quick_edit")}>Quick Edit</a>
                  |
              </span>
              <span className="trash">
                  <a onClick={this.onActionApplyClick.bind(this, "trash")} className="submitdelete">Trash</a>
                  |
              </span>
              <span className="published">
                  <a onClick={this.onActionApplyClick.bind(this, "publish")} className="published">Published</a>
              </span>
          </div>
        )
    }

    renderRowActionForTrash() {
        return (
          <div className="row-actions">
              <span className="untrash">
                  <a onClick={this.onActionApplyClick.bind(this, "restore")} className="untrash">Restore</a>
                  |
              </span>
              <span className="delete">
                  <a onClick={this.onActionApplyClick.bind(this, "delete_permanently")} className="delete">Delete Permanently</a>
                  |
              </span>

          </div>
        )
    }

    render() {
        const status = this.props.location.query.status;
        switch (status) {
            case "filter":
                return (
                  <div>{this.renderRowActionForFilter()}</div>
                );
            case "trash":
                return (
                  <div>{this.renderRowActionForTrash()}</div>
                );
            default:
                return (
                  <div>{this.renderRowAction()}</div>
                )
        }

    }

}

AppAdminTopicItemAction.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

AppAdminTopicItemAction.displayName = "AppAdminTopicItemAction";

module.exports = withRouter(AppAdminTopicItemAction);
export default withRouter(AppAdminTopicItemAction);
