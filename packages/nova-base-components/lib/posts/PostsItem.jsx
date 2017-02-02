import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

let is = require('is_js');

class PostsItem extends Component {
    // A: Title + Image should open the “Read More” link - link to the original article
    // B: Title + Image in post list is like in post detail. click them will open original url?
    // A: YES

    renderContent(showActionButtons) {
        const {post} = this.props;

        //const sectionClass = (showActionButtons) ? "content_3oLx4" : "content_3oLx4_base";
        const sectionClass = "row " + (showActionButtons ? "row_margin_bottom30" : "");
        return (
          <div className={sectionClass}>
              <div>
                  <a onClick={this.onReadMoreClick.bind(this)}
                     className="title_2p9fd featured_2W7jd default_tBeAo base_3CbW2 post-title">
                      {Posts.getEmojiStripedString(post.title)}
                  </a>
                  <a style={{display: 'inline-block'}}>
                        <span className="domain"
                              onClick={this.onDomainClick.bind(this)}>
                            { (post.sourceFrom ? post.sourceFrom : '').replace('www.', '')}
                        </span>
                  </a>
              </div>

              <a className="post_description post_description_p"
                 onClick={this.popupDetail.bind(this)}>
                  {Posts.getLimitedContent(post.excerpt, 150)}
              </a>
          </div>
        )
    }

    renderThumbnail() {
        const {post} = this.props,
          imageSet = Posts.getThumbnailSet(post);
        //imageSet = {
        //    small: '/packages/public/images/downvote-burst-white.png',
        //    large: '/packages/public/images/downvote-burst-white.png'
        //};

        if (imageSet.small) {
            return (
              <div className="post-thumbnail thumbnail_JX64A thumbnail post-left-thumbnail">
                  <a onClick={this.onReadMoreClick.bind(this)}>
                      <div className="container_22rD3 post-list-thumbnail">
                          <Telescope.components.BlurryImage
                            imageId={post._id + "-thumbnail"}
                            containerClass={"container__Ql6q lazyLoadContainer_3KgZD"}
                            imageClass={"post-list-thumbnail"}
                            imageSet={imageSet}
                            imageWidth={100}
                            imageHeight={100}
                            imageTitle={post.title}
                          />
                      </div>
                  </a>
              </div>
            )
        }
        return null;
    }

    renderEditAction(postCanEdit) {
        if (postCanEdit) {
            const {post} = this.props;
            return (
              <Telescope.components.CanDo action="posts.edit.own" document={post}>
                  <Telescope.components.PostsItemEditActions post={post}/>
              </Telescope.components.CanDo>
            )
        }
        return null;
    }

    render() {
        const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>

        const {location, post, canEdit} = this.props,
          admin = Users.checkIsAdmin(location, user),
          showActionButtons = (!!admin || post.status == Posts.config.STATUS_APPROVED),
          postCanEdit = !!admin || canEdit;

        return (
          <li className='postItem_block'>
              <div className="postItem_2pV9v">
                  {this.renderEditAction(postCanEdit)}
                  <div className="link_3fUGJ"
                       onClick={this.popupDetail.bind(this)}>
                      {this.renderThumbnail()}
                      {this.renderContent(showActionButtons)}
                  </div>
                  <Telescope.components.PostsItemActions {...this.props}/>
              </div>
          </li>
        )
    }

    onReadMoreClick(event) {
        event.preventDefault();
        const {post} = this.props;
        const url = post.url;
        const isChrome = is.chrome();

        Users.openNewBackgroundTab(event.target, url);

        event.stopPropagation();
    }

    onDomainClick(event) {
        event.preventDefault();
        const {post} = this.props;
        this.context.messages.pushNewLocationPathWithDelay(this.props.router, {pathname: "/", query: {from: post.sourceFrom}});

        event.stopPropagation();
    }

    popupDetail(event) {
        event.preventDefault();

        const {user} = this.props; // Important: <* props.user (Maybe user is not Logged user)*>
        const {router, post, location}=this.props;
        if (post.status === Posts.config.STATUS_APPROVED) {
            this.context.messages.pushRouterForDetailPage(router, post, Users.checkIsAdmin(location, user));
        }

        event.stopPropagation();
    }

}

PostsItem.propTypes = {
    post: React.PropTypes.object.isRequired
};

PostsItem.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(PostsItem);
export default withRouter(PostsItem);
