import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

const PostsList = ({
  results,
  currentUser,
  hasMore,
  ready,
  count,
  totalCount,
  limit,
  firstPagination = false,
  loadMore,
  checkReady = false,
  showHeader = false,
  title,
  showClose = false,
  dismissBanner = null
}) => {

    const loadMoreMessage = "All good things take time";

    const showReady = Posts.showReady(results, hasMore, ready, count, totalCount, limit, firstPagination);
    if (showReady) {
        return (
          <section className="results_37tfm">
              {showHeader ? (<div>
                    <div className="fullWidthBox_3Dggh box_c4OJj">
                        <div className="content_DcBqe">
                            <Telescope.components.PostsListTitle title={title} showClose={showClose} dismissBanner={dismissBanner}/>
                        </div>
                    </div>
                </div>) : null}
              <Telescope.components.PostsLoading message={loadMoreMessage}/>
          </section>
        )
    } else if (!!results && !!results.length) {
        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          {showHeader ? <Telescope.components.PostsListTitle title={title} showClose={showClose} dismissBanner={dismissBanner}/> : null}

                          <div className="posts_275PF">
                              <ul className="postsList_2tOc7">
                                  {results.map((post, index) =>
                                    <Telescope.components.PostsItem key={post._id} post={post} user={currentUser} type={"save"} canEdit={false}/>
                                  )}
                              </ul>
                          </div>
                      </div>
                      {hasMore ? (ready ? <Telescope.components.PostsLoadMore loadMore={loadMore}/> : null) : null}
                  </div>
              </div>
              {hasMore ? (ready ? null : <Telescope.components.PostsLoading message={loadMoreMessage}/>) : null}
          </section>
        )
    } else {
        return (
          <section className="results_37tfm">
              {showHeader ? (
                  <div>
                      <div className="fullWidthBox_3Dggh box_c4OJj">
                          <div className="content_DcBqe">
                              <Telescope.components.PostsListTitle title={title} showClose={showClose} dismissBanner={dismissBanner}/>
                          </div>
                      </div>
                  </div>
                ) : null}
              <Telescope.components.PostsNoResults relatedList={false}/>
          </section>
        )
    }
};

PostsList.displayName = "PostsList";

module.exports = PostsList;