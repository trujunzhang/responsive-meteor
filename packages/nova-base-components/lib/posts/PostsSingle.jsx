import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

const PostsSingle = (props, context) => {
    const relatedPostCount = 6;
    const terms = {...props.params, limit: relatedPostCount};

    return (
      // Important: Using <*PostDocumentContainer*> here.
      <Telescope.components.PostDocumentContainer
        key={terms._id}
        collection={Posts}
        publication="posts.single.with.related.list"
        selector={{_id: terms._id}}
        terms={terms}
        joins={Posts.getJoins()}
        documentPropName="post"
        serverTag="relatedIds"
        componentProps={{relatedPostCount: relatedPostCount}}
        component={Telescope.components.PostsPage}
      />
    )
};

PostsSingle.displayName = "PostsSingle";

module.exports = PostsSingle;
