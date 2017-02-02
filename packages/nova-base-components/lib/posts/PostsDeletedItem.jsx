import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class PostsDeletedItem extends Component {
    //onRemoveClick(e) {
    //    event.preventDefault();
    //    const {post, folder} = this.props;
    //    folder['lastPost'] = post._id;
    //    const modifier = {...folder, lastPost: post._id};
    //
    //    this.context.actions.call('folders.removePost', folder, (error, result) => {
    //        if (!!error) {
    //            this.context.messages.flash("Delete the post " + post.title + " failure", "error");
    //        }
    //    });
    //    event.stopPropagation();
    //}

    //renderRemoveIcon() {
    //    const {user} = this.props,
    //      {currentUser} = this.context;
    //    if (user._id === currentUser._id) {
    //        return (
    //          <span className="close_deleted_post" onClick={this.onRemoveClick.bind(this)}>
    //              <svg width="12" height="12" viewBox="0 0 12 12">
    //                  <path d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
    //              </svg>
    //          </span>
    //        )
    //    }
    //
    //    return null;
    //}

    renderContent() {
        return (
          <div className="row" id="posts_deleted_item_section">
              <div className="fullWidthBox_3Dggh container_R3fsF" id="posts_deleted_item_panel">
                  <div className="content_DcBqe">
                      <div className="boxContent_2e30p">
                          <h2 className="heading_woLg1 title_2vHSk subtle_1BWOT base_3CbW2">
                              [Deleted Article]
                          </h2>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    renderThumbnail() {
        return (
          <div className="post-thumbnail thumbnail_JX64A thumbnail post-left-thumbnail">
              <a >
                  <div className="container_22rD3 post-list-thumbnail">
                      <img src="/packages/public/images/politicl-logo.png"/>
                  </div>
              </a>
          </div>
        )
    }

    render() {
        return (
          <li className='postItem_block'>
              <div className="postItem_2pV9v">
                  <div className="link_3fUGJ">
                      {this.renderThumbnail()}
                      {this.renderContent()}
                  </div>
              </div>
          </li>
        )
    }
}

PostsDeletedItem.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(PostsDeletedItem);
export default withRouter(PostsDeletedItem);
