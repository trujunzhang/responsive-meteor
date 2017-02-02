import React, {PropTypes, Component} from 'react';

class CommentsEmpty extends Component {
    render() {
        return (
            <div className="placeholder_33khS box_2b3oc">
                <p>No comments yet. Why don't you start the discussion?</p>
            </div>
        )
    }


    renderxxx() {
        return (
          <div className="placeholder_33khS box_2b3oc">
              <img alt="comments" src="/packages/public/images/comments.png"/>
          </div>
        )
    }

}

CommentsEmpty.displayName = "CommentsEmpty";

module.exports = CommentsEmpty;
export default CommentsEmpty;
