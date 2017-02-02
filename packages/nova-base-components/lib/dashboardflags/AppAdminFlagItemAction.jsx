import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';


class AppAdminFlagItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.flag);
    }

    renderPostStatus(){
        const {flag} = this.props,
        {post} = flag,
        {status} = post;

        if(status === Posts.config.STATUS_APPROVED ){
            return(
              <span className="status">
                  <a onClick={this.onActionApplyClick.bind(this, "unpublish")}>Unpublish</a>
                  |</span>
         )
        }
        return(
              <span className="status">
                  <a onClick={this.onActionApplyClick.bind(this, "publish")}>publish</a>
                  |</span>
        )
    }

    // View | Edit | Delete | Unpublish | Delete Reports
    renderRowAction() {
        return (
            <div className="row-actions">
                <span className="view">
                    <a onClick={this.onActionApplyClick.bind(this, "preview")}>Preview</a>
                |</span>
                <span className="edit">
                    <a onClick={this.onActionApplyClick.bind(this, "edit")}>Edit</a>
                  |</span>
              <span className="delete">
                  <a onClick={this.onActionApplyClick.bind(this, "delete_all")}>Delete</a>
            |</span>
              {this.renderPostStatus()}
              <span className="delete">
                  <a className="submitdelete" onClick={this.onActionApplyClick.bind(this, "delete_permanently")}>Delete Reports</a>
                  |</span>
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

AppAdminFlagItemAction.displayName = "AppAdminFlagItemAction";

module.exports = withRouter(AppAdminFlagItemAction);
export default withRouter(AppAdminFlagItemAction);
