import Telescope from 'meteor/nova:lib';
import React from 'react';

const CommentsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

    if (ready &&!!results.length) {
        return (
          <Telescope.components.CommentsNodeList results={results}
                                                 currentUser={currentUser}
                                                 hasMore={hasMore}
                                                 ready={ready}
                                                 count={count}
                                                 totalCount={totalCount}
                                                 loadMore={loadMore}/>
        )
    } else if (!ready) {
        return (
          <div className="comments-list">
              <Telescope.components.Loading/>
          </div>
        )
    } else {
        return (
          <Telescope.components.CommentsEmpty/>
        )
    }

};

CommentsList.displayName = "CommentsList";

module.exports = CommentsList;
