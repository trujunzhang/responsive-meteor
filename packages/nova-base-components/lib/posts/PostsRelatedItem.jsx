import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

import Posts from "meteor/nova:posts";

class PostsRelatedItem extends Component {

    renderThumbnail(imageSet) {
        const {post} = this.props;
        return (
          <div className="thumbnail_2Blny">
              <div className="post-thumbnail related-thumbnail" onClick={this.onRelatedPostClick.bind(this)}>
                  <a className="container_22rD3 related-thumbnail">
                      <Telescope.components.BlurryImage
                        imageId={post._id + "-thumbnail"}
                        containerClass={"container__Ql6q lazyLoadContainer_3KgZD"}
                        imageClass={"post-list-thumbnail"}
                        imageSet={imageSet}
                        imageWidth={62}
                        imageHeight={62}
                        imageTitle={post.title}
                      />
                  </a>
              </div>
          </div>
        )
    }

    renderVotesSection() {
        const {post} = this.props;
        return (
          <div className="smallSize_center secondaryText_PM80d">
              <div className="row">
                  <Telescope.components.RelatedPostUpvote post={post}/>
              </div>
              <div className="row">
                  <Telescope.components.RelatedPostDownvote post={post}/>
              </div>
          </div>
        )
    }

    render() {

        const {post} = this.props;
        const imageSet = Posts.getRelatedThumbnailSet(post);

        return (
          <div className="link_2Cj8i">
              <div className="side_3fRtk related-left-panel">
                  {!!imageSet.small ? this.renderThumbnail(imageSet) : null}
                  {this.renderVotesSection()}
              </div>
              <a onClick={this.onRelatedPostClick.bind(this)}>
                  <h2 className="name_DrXo8 featured_2W7jd default_tBeAo base_3CbW2">{post.title}</h2>
                  <p className="text_3Wjo0 subtle_1BWOT base_3CbW2">
                      {Posts.getLimitedContent(post.excerpt, 100)}
                  </p>
              </a>
          </div>
        )
    }

    onRelatedPostClick(event) {
        event.preventDefault();
        const {currentUser, messages} = this.context;
        let {router, post}=this.props;
        let admin = messages.appManagement.getAdmin(this.props.location, currentUser);
        messages.pushRouterForDetailPage(router, post, admin);
    }

}

PostsRelatedItem.propTypes = {
    post: React.PropTypes.object.isRequired
};

PostsRelatedItem.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(PostsRelatedItem);
export default withRouter(PostsRelatedItem);
