import Telescope from 'meteor/nova:lib';
import React from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

const UsersSubmittedPostsList = (props, context) => {
    const user = props.user; // Important: <* props.user (Maybe user is not Logged user)*>

    const postCount = user.telescope.postCount;

    const terms = {
        view: 'userPosts',
        postsType: 'user.posts',
        userId: user._id,
        submitter: user._id,
        listId: "user.profile.submitted.posts.list",
        limit: 10
    };
    const {selector, options} = Posts.parameters.get(terms);

    return (
      <Telescope.components.NewsListContainer
        collection={Posts}
        selector={selector}
        options={options}
        terms={terms}
        publication="user.posts.list"
        joins={Posts.getJoins()}
        component={Telescope.components.UserVotedPostsList}
        cacheSubscription={false}
        componentProps={
            {
                title: postCount + " articles submitted ",
                emptyHint: "No submitted posts yet.",
                canEdit: true,
                user:user
            }
        }
        listId={terms.listId}
        limit={terms.limit}
      />
    )
};

UsersSubmittedPostsList.displayName = "UsersSubmittedPostsList";

module.exports = UsersSubmittedPostsList;
