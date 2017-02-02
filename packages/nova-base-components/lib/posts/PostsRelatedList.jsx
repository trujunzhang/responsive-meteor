import Telescope from 'meteor/nova:lib';
import React from 'react';

const PostsRelatedList = ({results, currentUser, ready}) => {

    const loadMoreMessage = "All good things take time";

    if (ready && !!results.length) {
        return (
          <div>
              {results.map(post =>
                <Telescope.components.PostsRelatedItem key={post._id} post={post} currentUser={currentUser}/>
              )}
          </div>
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
              <Telescope.components.PostsNoResults relatedList={true}/>
          </section>
        )
    }

};

PostsRelatedList.displayName = "PostsRelatedList";

module.exports = PostsRelatedList;