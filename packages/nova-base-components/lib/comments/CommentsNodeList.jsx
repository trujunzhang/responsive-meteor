import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Comments from "meteor/nova:comments";

class CommentsNodeList extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            showMore: true
        };
    }

    onShowMoreClick() {
        this.setState({showMore: false});
    }

    render() {
        const {currentUser, results} = this.props;
        const limitedResults = Comments.getLimitedComments(results, 3, this.state.showMore);
        let hasMore = this.state.showMore;
        if (limitedResults.length == results.length) {
            hasMore = false;
        }
        const ready = this.props.ready,
        count = limitedResults.length,
        totalCount = this.props.totalCount;

        return (
          <div className="discussion_cr2q_">

              {limitedResults.map(comment => <Telescope.components.CommentsNode comment={comment} key={comment._id} currentUser={currentUser}/>)}
              {hasMore ? (ready ?
                  <Telescope.components.CommentsLoadMore loadMore={this.onShowMoreClick.bind(this)} count={count} totalCount={totalCount}/> :
                  <Telescope.components.Loading/>) : null}
          </div>
        )
    }
}

CommentsNodeList.displayName = "CommentsNodeList";

module.exports = CommentsNodeList;
