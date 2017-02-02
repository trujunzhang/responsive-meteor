import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import Users from 'meteor/nova:users';

class UsersMenu extends Component {

    popoverUserMenus() {
        let button = this.refs.userProfile;
        let top = button.offsetTop;
        let left = button.offsetLeft;
        let width = button.clientWidth;
        let height = button.clientHeight;
        this.context.messages.showPopoverMenu("LoggedUserMenu",{},top, left, width, height);
    }

    render() {
        const avatarObj = Users.getAvatarObj(this.context.currentUser);
        return (
            <button
                ref="userProfile"
                id="user-menu"
                className="button button--small button--chromeless u-baseColor--buttonNormal is-inSiteNavBar js-userActions"
                onClick={this.popoverUserMenus.bind(this)}>
                <Telescope.components.UsersBlurryImageAvatar
                avatarObj={avatarObj}
                size={32}
                />
          </button>
        )
    }

}

UsersMenu.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
};

module.exports = UsersMenu;
export default UsersMenu;
