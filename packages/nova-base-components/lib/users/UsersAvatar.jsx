import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';
import {Link} from 'react-router';

const UsersAvatar = ({user, size, link}) => {

  const sizes = {
    small: "20px",
    medium: "30px",
    large: "50px"
  };

  const aStyle = {
    borderRadius: "100%",
    display: "inline-block",
    height: sizes[size],
    width: sizes[size]
  };

  const imgStyle = {
    borderRadius: "100%",
    display: "block",
    height: sizes[size],
    width: sizes[size]
  };

  const avatarUrl = Users.avatar.getUrl(user);

  const img = <img src={avatarUrl} height="32" width="32"/>;
  const initials = <span className="avatar-initials"><span>{Users.avatar.getInitials(user)}</span></span>;

  const avatar = avatarUrl ? img : initials;

  const inlineBlock = link ? <Link className="container__Ql6q lazyLoadContainer_3KgZD"
                                   to={Users.getProfileUrl(user)}>{avatar}</Link> : avatar;

  return (
    <div className="link_j6xU_ userImage_3lsm5">
                <span className="user-image">
                  <div style={{height: 32, width: 32}} className="container_22rD3 user-image--image">
                      {inlineBlock}
                  </div>
                </span>
    </div>
  )
};

UsersAvatar.propTypes = {
  user: React.PropTypes.object.isRequired,
  size: React.PropTypes.string,
  link: React.PropTypes.bool
};

UsersAvatar.defaultProps = {
  size: "medium",
  link: true
};

UsersAvatar.displayName = "UsersAvatar";

module.exports = UsersAvatar;
export default UsersAvatar;