import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

const UsersRecentCommentList = ({results, ready, count, totalCount, loadMore}) => {

    const loadMoreMessage = "";

    if (!!results.length) {
        return (
          <ol>
              {!!results && results.map((comment, index) => {
                    if (comment.post) {
                        return (<Telescope.components.UsersRecentCommentItem key={comment._id} comment={comment}/>);
                    }
                    return null;
                }
              )}
          </ol>
        )
    }
    else if (!ready) {
        return (
          <section className="results_37tfm">
              <Telescope.components.PostsLoading message={loadMoreMessage}/>
          </section>
        )
    }
    else {
        return (
          <div className="content_DcBqe">
              <div className="placeholder_lYzpv">
                  <span className="text_3Wjo0 subtle_1BWOT base_3CbW2 no-comments-message">{"No comments yet."}</span>
              </div>
          </div>
        )
    }
};

UsersRecentCommentList.displayName = "UsersRecentCommentList";

module.exports = UsersRecentCommentList;

