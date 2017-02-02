import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class UsersRecentCommentItem extends Component {

    onCommentClick() {
        const {comment} = this.props,
          {post} = comment;
        this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {postId: post._id, title: post.slug}});
    }

    render() {
        const {comment} = this.props,
          {post} = comment;
        return (
          <li className="sidebarItem_175e3">
              <span className="sidebarItemEmoji_zp1pV">💬</span>
              <a className="sidebarItemLink_2RXkK ellipsis_2lgar text_3Wjo0 subtle_1BWOT base_3CbW2"
                 onClick={this.onCommentClick.bind(this)}>{post.title}
              </a>
          </li>
        )
    }
}

UsersRecentCommentItem.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersRecentCommentItem.displayName = "UsersRecentCommentItem";

module.exports = withRouter(UsersRecentCommentItem);
export default withRouter(UsersRecentCommentItem);

