import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

class CommentsNode extends Component {

    renderComment(comment) {

        return (
          <Telescope.components.CommentsItem comment={comment} key={comment._id} currentUser={this.props.currentUser}/>
        )
    }

    renderChildren(children) {
        return (
          <div className="comments-children">

          </div>
        )
    }

    render() {

        const {comment} = this.props;
        const children = this.props.comment.childrenResults;

        return (
          <div className="thread_1dWPf" id={comment._id}>
              {this.renderComment(comment)}
              <div>
                  {children ? children.map(comment => <CommentsNode comment={comment} key={comment._id} currentUser={this.props.currentUser}/>) : ""}
              </div>
          </div>
        )
    }

}

CommentsNode.propTypes = {
    comment: React.PropTypes.object.isRequired, // the current comment
    currentUser: React.PropTypes.object, // the current user
};

module.exports = CommentsNode;