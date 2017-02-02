import React, {PropTypes, Component} from 'react';

class CommentDownvote extends Component {

    onDownvoteClick(event) {
        event.preventDefault();
        const {comment} = this.props;
        const {currentUser} = this.context;

        if (!currentUser) {
            this.context.messages.showLoginUI();

        } else if (currentUser.hasDownvoted(comment)) {
            this.context.actions.call('comments.cancelDownvote', comment._id, (error, result) => {
            });
        } else {
            this.context.actions.call('comments.downvote', comment._id, (error, result) => {
            });
        }

        event.stopPropagation();
    }

    render() {
        const {comment} = this.props;

        return (

          <a rel="comment-upvote"
             onClick={this.onDownvoteClick.bind(this)}
             className="upvote_3Nd3Q action_Hv6P3 secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                  <span>
                    <svg width="9" height="8" viewBox="0 0 9 8">
                      <path d="M9,8 L0,8 L4.5,0 L9,8 Z" transform="scale(1,-1) translate(0,-9)" fill="#999"/>
                    </svg>
                  </span>
              <span className="noVotesLabel_1gl1X">{comment.downvotes || 0}</span>
          </a>
        )
    }
}

CommentDownvote.propTypes = {
    comment: React.PropTypes.object.isRequired, // the current comment
};

CommentDownvote.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = CommentDownvote;
export default CommentDownvote;
