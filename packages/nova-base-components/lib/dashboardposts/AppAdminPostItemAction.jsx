import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class AppAdminPostItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.post);
    }

    renderRowAction() {
        return (
          <div className="row-actions">
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "edit")}>Edit</a>
                  |</span>
              <span className="edit">
                  <a onClick={this.onActionApplyClick.bind(this, "quick_edit")}>Quick Edit</a>
                  |</span>
              <span className="trash">
                  <a className="submitdelete" onClick={this.onActionApplyClick.bind(this, "trash")}>Trash</a>
                  |</span>
              <span className="view">
                  <a rel="permalink" onClick={this.onActionApplyClick.bind(this, "preview")}>Preview</a>
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

AppAdminPostItemAction.displayName = "AppAdminPostItemAction";

module.exports = withRouter(AppAdminPostItemAction);
export default withRouter(AppAdminPostItemAction);
