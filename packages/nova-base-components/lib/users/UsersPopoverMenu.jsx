import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class UsersPopoverMenu extends Component {

    constructor(props, context) {
        super(props);

        const {currentUser} = context;
        const invitesCount = 0;
        const loggedUserMenu = [
            {type: "profile", link: Users.getLinkObject("profile", currentUser), title: "MY PROFILE"},

            {type: "collections", link: Users.getLinkObject("collections", currentUser), title: "MY COLLECTIONS"},

            //{type: "invites", link: "/users/" + currentUser.telescope.slug + "/invites", title: "MY INVITES (" + invitesCount + ")"},
            {type: "separator"},
            {type: "settings", link: Users.getLinkObject("editing"), title: "SETTINGS"},

            {type: Users.isAdmin(currentUser) ? "management" : "", link: {pathname: "/management"}, title: "MANAGEMENT"},
            {type: "separator"},
            {type: "logout", title: "LOGOUT"}
        ];

        this.state = this.initialState = {
            loggedUserMenu: loggedUserMenu
        };
    }

    onMenuItemClick(menu) {
        const {router} = this.props;
        const {messages} = this.context;
        switch (menu.type) {
            case "logout":
                Meteor.logout(function () {
                    router.replace({pathname: '/'});
                    messages.dismissPopoverMenu();
                });
                break;
            case "line":
                break;
            default:
                messages.pushRouter(router, menu.link);
                messages.dismissPopoverMenu();
                break;
        }
    }

    renderRow(menu) {
        if (menu.type == "line") {
            return (<hr className="separator_1hgCe"/>);
        }

        return (
          <a onClick={this.onMenuItemClick.bind(this, menu)}>{menu.title}</a>
        );
    }

    render() {
        const {comp} = this.props;
        const {loggedUserMenu} = this.state;

        const top = comp.top + comp.height + 24;
        let left = (comp.left + comp.width / 2) - 75;

        let popoverClass = "popover v-bottom-center";
        if (left + 150 >= $(window).width()) {
            popoverClass = "popover v-bottom-left";
            left = left - 50;
        }

        return (
          <div id="medium-popover-user-menus" className={popoverClass} style={{top: top, left: left}}>
              <ul className="content_2mq4P">
                  {loggedUserMenu.map((menu, key) => {
                      if (menu.type === "") {
                          return (<li key={key}/>);
                      }
                      else if (menu.type === "separator") {
                          return (
                            <li key={key} className="list-item list-item--separator"/>
                          )
                      }
                      return (
                        <li key={key} className="option_2XMGo secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                            <a
                              className="button button--dark button--chromeless u-baseColor--buttonDark"
                              onClick={this.onMenuItemClick.bind(this, menu)}>
                                {menu.title}
                            </a>
                        </li>
                      )
                  })}
              </ul>

          </div>
        )
    }

}

UsersPopoverMenu.propTypes = {
    user: React.PropTypes.object
};

UsersPopoverMenu.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

module.exports = withRouter(UsersPopoverMenu);
export default withRouter(UsersPopoverMenu);
