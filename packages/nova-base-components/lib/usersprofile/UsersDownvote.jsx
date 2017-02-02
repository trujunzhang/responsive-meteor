import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

const UsersDownvote = (props, context) => {
    const user = props.user; // Important: <* props.user (Maybe user is not Logged user)*>
    const {cachedIds} = props;

    //const posts = user.telescope.downvotedPosts;
    //const count = (posts && posts.length > 0) ? posts.length : 0;

    const count = cachedIds.length;

    const terms = {
        view: 'userVotePosts',
        postsType: 'user.posts',
        cachedIds: cachedIds,
        listId: "user.profile.downvote.posts.list",
        limit: 10
    };
    const {selector,options} = Posts.parameters.get(terms);

    return (
      <div>
          <Telescope.components.NewsListContainer
            collection={Posts}
            selector={selector}
            options={options}
            terms={terms}
            publication="user.posts.list"
            joins={Posts.getJoins()}
            component={Telescope.components.UserVotedPostsList}
            componentProps={{
                title: count + " Downvotes",
                emptyHint: "No downvotes yet.",
                user:user
            }}
            listId={terms.listId}
            limit={terms.limit}
          />
      </div>
    )
};

UsersDownvote.displayName = "UsersDownvote";

module.exports = UsersDownvote;
