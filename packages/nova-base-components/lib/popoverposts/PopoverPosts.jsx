import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

/**
 * @return {null}
 */
class PopoverPosts extends Component {
    constructor(props, context) {
        super(props);

        this.state = this.initialState = {
            didMount: false
        };
    }

    componentDidMount() {
        this.setState({didMount: true});
    }

    render() {
        const {posts} = this.props,
          showPopupPost = posts && posts.length > 0;
        if (this.state.didMount) {
            document.body.className = showPopupPost ? "no-scroll" : "";
        }
        if (showPopupPost) {
            return (
              <Telescope.components.PopoverPostsLayout >
                  <Telescope.components.PostsSingle params={{_id: posts[posts.length - 1].postId, slug: posts[posts.length - 1].slug}}/>
              </Telescope.components.PopoverPostsLayout>
            )
        }
        return null;
    }
}

PopoverPosts.displayName = "PopoverPosts";

module.exports = PopoverPosts;
export default PopoverPosts;
