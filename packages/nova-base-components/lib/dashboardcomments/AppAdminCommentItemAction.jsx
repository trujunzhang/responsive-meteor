import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';

class AppAdminCommentItemAction extends Component {

    onActionApplyClick(actionType) {
        this.props.actionEvent(actionType, this.props.comment);
    }

    renderRowAction() {
        // all
        // Approve | Reply | Quick Edit | Edit | Spam | Trash
        const {comment} = this.props,
          approveTtitle = (comment.status === Comments.config.STATUS_APPROVED) ? "Unapprove" : "Approve";
        return (
          <div className="row-actions">
              <span className={approveTtitle.toLowerCase()}>
                  <a onClick={this.onActionApplyClick.bind(this, approveTtitle.toLowerCase())}>{approveTtitle}</a>
                  |</span>
              {/*<span className="reply hide-if-no-js">*/}
              {/*<a className="vim-r comment-inline" onClick={this.onActionApplyClick.bind(this, "reply")}>Reply</a>*/}
              {/*|</span>*/}
              <span className="quickedit hide-if-no-js">
                  <a className="vim-q comment-inline" onClick={this.onActionApplyClick.bind(this, "quick_edit")}>Quick Edit</a>
                  |</span>
              {/*<span className="edit">*/}
              {/* <a onClick={this.onActionApplyClick.bind(this, "edit")}>Edit</a>*/}
              {/*|</span>*/}
              <span className="spam">
                  <a className="vim-s vim-destructive" onClick={this.onActionApplyClick.bind(this, "spam")}>
                      Spam
                  </a>
                  |
              </span>
              <span className="trash">
                  <a className="delete vim-d vim-destructive" onClick={this.onActionApplyClick.bind(this, "trash")}>Trash</a>
              </span>
          </div>
        )
    }

    renderRowActionForSpam() {
        return (
          <div className="row-actions">
              <span className="unspam unapprove">
                  <a onClick={this.onActionApplyClick.bind(this, "restore")}
                     className="untrash">
                      Not Spam
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

    renderRowActionForTrash() {
        return (
          <div className="row-actions">
              <span className="spam">
                  <a className="vim-s vim-destructive" onClick={this.onActionApplyClick.bind(this, "spam")}>
                      Spam
                  </a>
                  |
              </span>
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
            case "spam":
                return (
                  <div>{this.renderRowActionForSpam()}</div>
                );
            case "trash":
                return (
                  <div>{this.renderRowActionForTrash()}</div>
                );
            default:// all
                return (
                  <div>{this.renderRowAction()}</div>
                );
        }
    }

}

AppAdminCommentItemAction.displayName = "AppAdminCommentItemAction";

module.exports = withRouter(AppAdminCommentItemAction);
export default withRouter(AppAdminCommentItemAction);
