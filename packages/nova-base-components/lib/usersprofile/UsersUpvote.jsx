import Telescope from 'meteor/nova:lib';
import React from 'react';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

const UsersUpvote = (props, context) => {
    const user = props.user; // Important: <* props.user (Maybe user is not Logged user)*>
    const {cachedIds} = props;

    //const posts = user.telescope.upvotedPosts;
    //const count = (posts && posts.length > 0) ? posts.length : 0;

    const count = cachedIds.length;

    const terms = {
        view: 'userVotePosts',
        postsType: 'user.posts',
        cachedIds: cachedIds,
        listId: "user.profile.upvote.posts.list",
        limit: 10
    };
    const {selector, options} = Posts.parameters.get(terms);

    return (
      <div>
          <Telescope.components.NewsListContainer
            collection={Posts}
            publication="user.posts.list"
            selector={selector}
            options={options}
            terms={terms}
            joins={Posts.getJoins()}
            component={Telescope.components.UserVotedPostsList}
            componentProps={{
                title: count + " Upvotes",
                emptyHint: "No upvotes yet.",
                user: user
            }}
            listId={terms.listId}
            limit={terms.limit}
          />
      </div>
    )

};

UsersUpvote.displayName = "UsersUpvote";

module.exports = UsersUpvote;
