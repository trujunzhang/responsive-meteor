import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

class PostDetail extends Component {

    renderArticleImage() {
        const {post} = this.props;
        const imageSet = Posts.getDetailedPageImageSet(post);
        if (post.thumbnailUrl) {
            return (
              <div className="canvasWrapper_3pQxU">
                  <div className="canvas_3tuA5">
                      <Telescope.components.BlurryImage
                        imageId={"post-detail"}
                        containerClass={"container_22rD3 post_image"}
                        imageClass={"placeholder_E_0qw"}
                        imageSet={imageSet}
                        imageWidth={"auto"}
                        imageHeight={315}
                        imageTitle={post.title}
                      />
                  </div>
              </div>
            )
        }
        return null;
    }

    render() {

        const {post} = this.props;
        let html = post.htmlBody;
        if (html) {
            html = '<p>' + html.replace('\n' + '\n', '</p><p>') + '...</p>';
        }
        const htmlBody = {__html: html};
        return (
          <section className="container_3tEOd">
              {/*post's content*/}
              <div className="post_page_body" dangerouslySetInnerHTML={htmlBody}/>
          </section>
        )
    }
}

PostDetail.contextTypes = {
    messages: React.PropTypes.object
};

PostDetail.displayName = "PostDetail";

module.exports = PostDetail;
export default PostDetail;
