import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {intlShape, FormattedMessage, FormattedRelative} from 'react-intl';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminCommentItem extends Component {

    constructor(props, context) {
        super(props);

        this.state = {isEventCalling: false, parentUser: null, didMount: false};

        const {comment} = props,
          {parentCommentId} = comment;

        if (parentCommentId) {
            context.actions.call('admin.comments.parentComment.username', parentCommentId, (error, result) => {
                if (!!error) {
                } else {
                    if (this.state.didMount) {
                        this.setState({isFetchedCache: true, parentUser: result})
                    } else {
                        this.state = {isFetchedCache: true, parentUser: result};
                    }
                }
            });
        }

    }

    componentDidMount() {
        this.setState({didMount: true})
    }

    checkIt() {
        this.props.checkRow(this.props.comment._id, !this.props.checked);
    }

    renderResponseTo() {
        const {comment} = this.props,
          {post} = comment;

        return (
          <div className="response-links">
              <a className="comments-edit-item-link"
                 onClick={(e) => {
                     e.preventDefault();
                     Users.openNewWindow("/", {admin: true, postId: this.props.comment.post._id, title: this.props.comment.post.slug});
                 }}>
                  {post.title}
              </a>
              <a className="comments-view-item-link">View Post</a>

              <Telescope.components.AppAdminResponseCounts comment={comment}/>
          </div>
        )
    }

    renderParentComment() {
        const {parentUser} = this.state;

        if (parentUser) {
            return (
              <div>
                  {"In reply to "}
                  <a onClick={(e) => {
                      Users.openNewWindow(Users.getLinkObject("profile", parentUser).pathname);
                  }}>
                      {Users.getDisplayName(parentUser)}
                  </a>
              </div>
            );
        }
        return null;
    }

    renderComment() {
        const {comment} = this.props,
          htmlBody = {__html: comment.htmlBody};

        return (
          <div>
              {this.renderParentComment()}
              <div dangerouslySetInnerHTML={htmlBody}></div>
              <Telescope.components.AppAdminCommentItemAction actionEvent={this.props.actionEvent} comment={comment}/>
          </div>
        )
    }

    render() {
        const {comment,location} = this.props,
          {post, user, postedAt} = comment,
          avatarObj = Users.getAvatarObj(user),
          displayName = Users.getDisplayName(user),
          email = Users.getUserEmail(user),
          updatedAt = moment(postedAt).format("YYYY/MM/DD at hh:mm");

        let trClass = "comment byuser bypostauthor even thread-even depth-1";

        return (
          <tr
            className={Comments.generateTrClass(trClass,location.query,comment)}>
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select " + post.title}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              <td className="author column-author">
                  <strong>
                      <img alt=""
                           src={avatarObj.url}
                           className="avatar avatar-32 photo"
                           height="32" width="32"/>
                      {!!displayName ? displayName : "-" }
                  </strong>
                  <br/>
                  <Telescope.components.MailTo email={email}/>
              </td>
              <td className="comment column-comment has-row-actions column-primary">
                  {this.renderComment()}
              </td>
              <td className="response column-response">
                  {this.renderResponseTo()}
              </td>
              <td className="date column-date">
                  <div className="submitted-on">
                      <a >
                          {updatedAt}
                      </a>
                  </div>
              </td>
          </tr>
        )
    }

}

AppAdminCommentItem.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

AppAdminCommentItem.displayName = "AppAdminCommentItem";

module.exports = withRouter(AppAdminCommentItem);
export default withRouter(AppAdminCommentItem);
