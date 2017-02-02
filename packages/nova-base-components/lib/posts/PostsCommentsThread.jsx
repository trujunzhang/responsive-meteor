import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer} from "meteor/utilities:react-list-container";
import Comments from "meteor/nova:comments";

class PostsCommentsThread extends Component {

    onLoginClick() {
        this.context.messages.showLoginUI();
    }

    rendLoginUI() {
        return (
          <div className="access_5Hx8h notice_CT78V box_2b3oc text_3Wjo0 subtle_1BWOT base_3CbW2 margin_bottom12">
              <span>Please login to comment or vote up/down.
                  <br/>
              </span>
              <a onClick={this.onLoginClick.bind(this)}>Login to continue.</a>
          </div>
        )
    }

    renderCommentForm() {
        return (
          <Telescope.components.CommentsNew type="comment" postId={this.props.document._id}/>
        )
    }

    renderRightSort() {
        return (
          <a className="sortToggle_3nVmh text_3Wjo0 subtle_1BWOT base_3CbW2">most upvoted
              <span className="icon_2JDiK">
                      <svg width="8" height="5" viewBox="0 0 8 5">
                          <path
                            d="M6.752 1.514C7.472.678 7.158 0 6.057 0H1.052C-.05 0-.332.654.426 1.46L2.38 3.54c.758.806 1.952.786 2.674-.054l1.698-1.972z"
                            fill="#A8ACB3"/>
                      </svg>
              </span>
          </a>
        )
    }

    render() {
        const post = this.props.document;
        const {currentUser} = this.context;

        return (
          <div className="discussion_cr2q_" id="comments">
              <h2 className="heading_2TFm8 heading_AsD8K title_2vHSk subtle_1BWOT base_3CbW2">Discussion</h2>

              { currentUser ? this.renderCommentForm() : this.rendLoginUI()}

              <div>
                  <ListContainer
                    collection={Comments}
                    publication="comments.list"
                    selector={{postId: post._id}}
                    terms={{postId: post._id, view: "postComments"}}
                    limit={0}
                    parentProperty="parentCommentId"
                    joins={Comments.getJoins()}
                    component={Telescope.components.CommentsList}
                    listId="comments.list"
                  />
              </div>
          </div>
        )
    }
}

PostsCommentsThread.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
};

PostsCommentsThread.displayName = "PostsCommentsThread";

module.exports = PostsCommentsThread;
export default PostsCommentsThread;
