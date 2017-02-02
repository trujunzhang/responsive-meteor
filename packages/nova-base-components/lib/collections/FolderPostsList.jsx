import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import React from 'react';

const FolderPostsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore, folder}) => {
    const loadMoreMessage = "All good things take time";

    const postIds = folder.posts;
    if (!!results.length) {
        const posts =
          results.map((post, index) => {
                if (Posts.isRemovedPost(post)) {
                    return (
                      <Telescope.components.PostsDeletedItem
                        key={post._id}
                        post={post}
                        user={folder.folderUser}
                        folder={folder}/>
                    )
                } else {
                    const type = (postIds.indexOf(post._id) === -1) ? "save" : "remove";
                    return (
                      <Telescope.components.PostsItem
                        key={post._id}
                        post={post}
                        user={folder.folderUser}
                        type={type}
                        folder={folder}
                        canEdit={false}/>
                    )
                }
            }
          );

        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          <div className="posts_275PF">
                              <ul className="FolderPostsList_2tOc7">
                                  {posts}
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
              <Telescope.components.PostsLoading message={loadMoreMessage}/>
          </section>
        )
    } else {
        return (
          <section className="results_37tfm">
              <div className="content_DcBqe">
                  <div className="placeholder_lYzpv">
                      <span className="text_3Wjo0 subtle_1BWOT base_3CbW2">No posts collected yet.</span>
                  </div>
              </div>
          </section>
        )
    }
};

FolderPostsList.displayName = "FolderPostsList";

module.exports = FolderPostsList;
