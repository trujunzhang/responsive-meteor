import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {intlShape, FormattedMessage, FormattedRelative} from 'react-intl';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

class AppAdminResponseCounts extends Component {

    onApprovedClick(e) {
        event.preventDefault();

    }

    onUnapprovedClick(e) {
        event.preventDefault();

    }

    render() {
        const {messages}=this.context;
        const {comment, router} = this.props,
          {post} = comment;
        let approvedCount = (comment.approvedCount ? comment.approvedCount : 0);
        let unapprovedCount = (comment.unapprovedCount ? comment.unapprovedCount : 0);
        const approvedCountUI = (
          <a className="post-com-count post-com-count-approved"
             onClick={(e) => {
                 e.preventDefault();
                 messages.appManagement.pushCommentQuery(router, {
                     postId: post._id,
                     status: "approved"
                 });
             }}>
              <span className="comment-count-approved">{approvedCount}</span>
              <span className="screen-reader-text">{approvedCount + " approved comment"}</span>
          </a>
        );
        const unapprovedCountUI = (
          <a className="post-com-count post-com-count-pending"
             onClick={(e) => {
                 e.preventDefault();
                 messages.appManagement.pushCommentQuery(router, {
                     postId: post._id,
                     status: "pending"
                 });
             }}>
              <span className="comment-count-pending">{unapprovedCount}</span>
              <span className="screen-reader-text">{unapprovedCount + " pending comments"}</span>
          </a>
        );
        return (
          <span className="post-com-count-wrapper post-com-count-453">
                {approvedCountUI}
              {unapprovedCount !== 0 ? unapprovedCountUI : null}
            </span>
        )
    }

}

AppAdminResponseCounts.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminResponseCounts.displayName = "AppAdminResponseCounts";

module.exports = withRouter(AppAdminResponseCounts);
export default withRouter(AppAdminResponseCounts);
