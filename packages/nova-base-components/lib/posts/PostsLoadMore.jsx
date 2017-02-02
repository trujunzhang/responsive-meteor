import React from 'react';

const PostsLoadMore = ({loadMore}) => {
    return (
      <a className="posts-load-more" onClick={loadMore}>Show More…</a>
    )
};

PostsLoadMore.displayName = "PostsLoadMore";

module.exports = PostsLoadMore;