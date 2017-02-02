import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

/**
 *
 * @param results
 * @param user  :    Important: <* props.user (Maybe user is not Logged user)*>
 * @param hasMore
 * @param ready
 * @param count
 * @param totalCount
 * @param loadMore
 * @param showHeader
 * @param title
 * @param emptyHint
 * @param canEdit
 * @returns {XML}
 * @constructor
 */
const UserVotedPostsList = ({results, user, hasMore, ready, count, totalCount, loadMore, showHeader = true, title, emptyHint, canEdit = false}) => {

    const loadMoreMessage = "All good things take time";

    // User should not be able to edit articles after they have been approved and posted by an admin.
    if (!!results.length) {
        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          <Telescope.components.PostsListTitle title={title}/>
                          <div className="posts_275PF">
                              <ul className="UserVotedPostsList_2tOc7">
                                  {results.map((post, index) => {
                                        if (Posts.isRemovedPost(post)) {
                                            return (
                                              <Telescope.components.PostsDeletedItem
                                                key={post._id}
                                                post={post}
                                                user={user}
                                              />
                                            )
                                        } else {
                                            let _canEdit = canEdit && (post.status == Posts.config.STATUS_APPROVED);
                                            return (
                                              <Telescope.components.PostsItem
                                                key={post._id}
                                                post={post}
                                                user={user}
                                                type={"save"}
                                                canEdit={_canEdit}/>
                                            )
                                        }
                                    }
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
    } else if (!ready) {
        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          <Telescope.components.PostsListTitle title={title}/>
                      </div>
                  </div>
              </div>
              <Telescope.components.PostsLoading message={loadMoreMessage}/>
          </section>
        )
    } else {
        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          <Telescope.components.PostsListTitle title={title}/>
                          <div className="content_DcBqe">
                              <div className="placeholder_lYzpv">
                                  <span className="text_3Wjo0 subtle_1BWOT base_3CbW2">{emptyHint}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
        )
    }
};

UserVotedPostsList.displayName = "UserVotedPostsList";

module.exports = UserVotedPostsList;
