import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';

class ArticleDownvote extends Component {

    constructor(props) {
        super(props);
    }

    onDownvoteClick(event) {
        event.preventDefault();
        const {post} = this.props;
        const {currentUser} = this.context;

        if (!currentUser) {
            this.context.messages.showLoginUI();
        } else if (currentUser.hasDownvoted(post)) {
            this.context.actions.call('posts.cancelDownvote', post._id, (error, result) => {
                this.context.events.track("post downvote cancelled", {'_id': post._id});
            });
        } else {
            this.context.actions.call('posts.downvote', post._id, (error, result) => {
                this.context.events.track("post downvoted", {'_id': post._id});
            });
        }

        event.stopPropagation();
    }

    render() {

        const {post} = this.props;

        return (
          <a onClick={this.onDownvoteClick.bind(this)}
             className="post-vote-button v-inlined v-category-tech postVoteButton_WsFJU button_2I1re solidVariant_2wWrf mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d whiteSolidColor_18W4g">
              <span className="post-vote-button--arrow">
                  <svg width="9" height="8" viewBox="0 0 9 8">
                      <path d="M9 8H0l4.5-8L9 8z" transform="scale(1,-1) translate(0,-9)" fill="#000"/>
                  </svg>
              </span>
              <span className="post-vote-button--count">
                  {post.downvotes || 0}
              </span>
          </a>
        )
    }
}

ArticleDownvote.propTypes = {
    post: React.PropTypes.object.isRequired, // the current post
};

ArticleDownvote.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = ArticleDownvote;
export default ArticleDownvote;
