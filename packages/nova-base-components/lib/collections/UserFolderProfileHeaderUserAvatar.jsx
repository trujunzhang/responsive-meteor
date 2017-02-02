import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserFolderProfileHeaderUserAvatar extends Component {

    render() {
        const {user} = this.props;
        const avatarUrl = Users.avatar.getUrl(user);
        const avatar = avatarUrl
          ? <img height="30" src={avatarUrl} width="30" className="placeholder_E_0qw placeholderHidden_pb7Bz"/>
          : "";

        return (
          <span className="user-image">
                <div className="container_22rD3 user-image--image user_folder_avatar">
                    <div className="container__Ql6q lazyLoadContainer_3KgZD">
                        {avatar}
                    </div>
                </div>
            </span>
        )
    }
}

UserFolderProfileHeaderUserAvatar.propTypes = {
    user: React.PropTypes.object.isRequired
};

UserFolderProfileHeaderUserAvatar.displayName = "UserFolderProfileHeaderUserAvatar";

module.exports = UserFolderProfileHeaderUserAvatar;
