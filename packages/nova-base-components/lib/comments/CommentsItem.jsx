import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {intlShape} from 'react-intl';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router'

class CommentsItem extends Component {

    constructor() {
        super();
        ['showReply',
            'replyCancelCallback',
            'replySuccessCallback',
            'showEdit',
            'editCancelCallback',
            'editSuccessCallback',
            'deleteComment'].forEach(methodName => {
            this[methodName] = this[methodName].bind(this)
        });
        this.state = {
            showReply: false,
            showEdit: false
        };
    }

    showReply(event) {
        event.preventDefault();
        const {currentUser} = this.props;
        if (!currentUser) {
            this.context.messages.showLoginUI();
        } else {
            this.setState({showReply: true,showEdit:false});
        }
    }

    replyCancelCallback(event) {
        event.preventDefault();
        this.setState({showReply: false});
    }

    replySuccessCallback() {
        this.setState({showReply: false});
    }

    showEdit(event) {
        event.preventDefault();
        this.setState({showReply:false,showEdit: true});
    }

    editCancelCallback(event) {
        event.preventDefault();
        this.setState({showEdit: false});
    }

    editSuccessCallback() {
        this.setState({showEdit: false});
    }

    deleteComment() {

        const {comment} = this.props;
        const deleteConfirmMessage = this.context.intl.formatMessage({id: "comments.delete_confirm"}, {body: Telescope.utils.trimWords(comment.body, 20)});
        const deleteSuccessMessage = this.context.intl.formatMessage({id: "comments.delete_success"}, {body: Telescope.utils.trimWords(comment.body, 20)});

        if (window.confirm(deleteConfirmMessage)) {
            this.context.actions.call('comments.deleteById', comment._id, (error, result) => {
                this.context.messages.flash(deleteSuccessMessage, "success");
                this.context.events.track("comment deleted", {'_id': comment._id});
            });
        }

    }

    renderComment() {
        const htmlBody = {__html: this.props.comment.htmlBody};

        return (
          <div className="body_221xI tech_Oe_Kz text_3Wjo0 default_tBeAo base_3CbW2">
              <div dangerouslySetInnerHTML={htmlBody}></div>
              {/*{!this.props.comment.isDeleted ?*/}
              {/*<a className="comments-item-reply-link" onClick={this.showReply}><Telescope.components.Icon*/}
              {/*name="reply"/> <FormattedMessage id="comments.reply"/></a> : null}*/}
          </div>
        )
    }

    renderReply() {
        return (
          <Telescope.components.CommentsNew
            postId={this.props.comment.postId}
            parentComment={this.props.comment}
            successCallback={this.replySuccessCallback}
            cancelCallback={this.replyCancelCallback}
            type="reply"
          />
        )
    }

    renderEdit() {
        return (
          <Telescope.components.CommentsEdit
            comment={this.props.comment}
            successCallback={this.editSuccessCallback}
            cancelCallback={this.editCancelCallback}
            type="reply"
          />
        )
    }

    onUserNameClick(e) {
        const {comment} = this.props,
        {user}= comment;
        if (!!user) {
            this.context.messages.pushRouter(this.props.router, Users.getLinkObject("profile", user));
        }
    }

    renderUserName() {
        const {comment} = this.props,
          {user} = comment,
          name = Users.getDisplayName(user),
          userName = (name === "") ? comment.author : name;

        if (!!user) {
            return (
              <div className="heading_3axGt">
                  <a className="boldText_3B8fa text_3Wjo0 default_tBeAo base_3CbW2"
                     onClick={this.onUserNameClick.bind(this)}>
                      {userName}
                  </a>
              </div>
            )
        }

        return (
          <div className="heading_3axGt">
              <span className="boldText_3B8fa text_3Wjo0 default_tBeAo base_3CbW2">{userName}</span>
              <em className="access_5Hx8h text_3Wjo0 subtle_1BWOT comments_item_user_name_deleted_title">
                  - deleted
              </em>
          </div>
        )
    }

    render() {
        const {comment} = this.props,
          {user} = comment,
          avatarUrl = Users.avatar.getUrl(user),
          name = Users.getDisplayName(user),
          userName = (name === "") ? comment.author : name;

        return (
          <div>
              <div className="link_j6xU_ userImage_3lsm5">
                  <Telescope.components.AvatarBlurryImage
                    imageId={comment._id}
                    containerClass={"avatar"}
                    imageClass={"avatar-image avatar-image--icon"}
                    imageSet={{small: avatarUrl, large: avatarUrl}}
                    imageWidth={32}
                    imageHeight={32}
                    imageTitle={userName}
                    isAvatar={true}
                  />
              </div>

              {this.renderUserName()}

              {/*{this.renderComment()}*/}
              {this.state.showEdit ? this.renderEdit() : this.renderComment()}

              <Telescope.components.CommentsItemAction
                showReply = {this.showReply}
                showEdit = {this.showEdit}
                comment = {comment} />
              {this.state.showReply ? this.renderReply() : null}
          </div>
        )
    }

}

CommentsItem.propTypes = {
    comment: React.PropTypes.object.isRequired, // the current comment
    currentUser: React.PropTypes.object, // the current user
};

CommentsItem.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    messages: React.PropTypes.object,
    events: React.PropTypes.object,
    intl: intlShape
};

CommentsItem.displayName = "CommentsItem";

module.exports = withRouter(CommentsItem);
export default withRouter(CommentsItem);

