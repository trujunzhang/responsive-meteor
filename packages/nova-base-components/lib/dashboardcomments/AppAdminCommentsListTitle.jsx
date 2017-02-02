import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

const AppAdminCommentsListTitle = props => {
    const {post} = props;
    return (
      <a  className="admin_comments_title"
        onClick={(e) => {
          Users.openNewWindow("/", {action: "edit", editId: post._id, admin: true});
      }}>
          {post.title}
      </a>
    )
};

AppAdminCommentsListTitle.displayName = "AppAdminCommentsListTitle";

module.exports = AppAdminCommentsListTitle;
