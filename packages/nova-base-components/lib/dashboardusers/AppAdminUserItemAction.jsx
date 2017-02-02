import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class AppAdminUserItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.user);
    }

    renderRowAction() {
        return (
          <div className="row-actions">
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "review")}>
                      Review
                  </a>
              </span>
          </div>
        )
    }

    renderRowActionForTrash() {
        return (
          <div className="row-actions">
              <span className="untrash">
                  <a onClick={this.onActionApplyClick.bind(this, "restore")}
                     className="untrash">
                      Restore
                  </a>
                  |
              </span>
              <span className="delete">
                  <a onClick={this.onActionApplyClick.bind(this, "delete_permanently")}
                     className="delete">
                      Delete Permanently
                  </a>
                  |
              </span>

          </div>
        )
    }

    render() {
        const status = this.props.location.query.status;
        switch (status) {
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

AppAdminUserItemAction.displayName = "AppAdminUserItemAction";

module.exports = withRouter(AppAdminUserItemAction);
export default withRouter(AppAdminUserItemAction);
