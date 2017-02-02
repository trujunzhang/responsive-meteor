import Telescope from 'meteor/nova:lib';
import React from 'react';

const FoldersList = ({
  results,
  user,
  hasMore,
  ready,
  count,
  totalCount,
  loadMore,
  title,
  emptyHint,
  showHeader = true
}) => {
    const loadMoreMessage = "All good things take time";

    return (

      <div>

          <div className="paddedBox_2UY-S box_c4OJj">
              <Telescope.components.PostsListTitle title={title}/>

              <div className="content_DcBqe">
                  {ready ? (
                      (results.length > 0 ?
                          <div className="grid_hjrL6">
                              {results.map((folder, index) => {
                                  return (<Telescope.components.FoldersItem key={index} folder={folder} user={user}/>)
                              })}
                          </div> :
                          <div className="placeholder_lYzpv">
                              <span className="emoji_1lBv0">📂</span>
                              <span className="text_3Wjo0 subtle_1BWOT base_3CbW2">{emptyHint}</span>
                          </div>
                      )
                    ) :
                    (
                      <section className="results_37tfm">
                          <Telescope.components.PostsLoading message={loadMoreMessage}/>
                      </section>
                    )}
              </div>
          </div>
      </div>
    )

};

FoldersList.displayName = "FoldersList";

module.exports = FoldersList;
