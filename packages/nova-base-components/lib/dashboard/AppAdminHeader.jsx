import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router'
import moment from 'moment';

class AppAdminHeader extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            isOpenSidebar: true,
            my_account_hover: false
        };
    }

    componentDidMount() {
        $('#right-user-menu').hover(
          function () {
              $(this).addClass('open')
          },
          function () {
              $(this).removeClass('open')
          }
        );
    }

    onToggleSidebarIconClick() {
        if (this.state.isOpenSidebar) {
            $('#admin-dashboard').removeClass('hold-transition skin-blue sidebar-mini').addClass('skin-blue sidebar-mini sidebar-collapse');
        } else {
            $('#admin-dashboard').removeClass('skin-blue sidebar-mini sidebar-collapse').addClass('hold-transition skin-blue sidebar-mini');
        }
        this.setState({isOpenSidebar: !this.state.isOpenSidebar})
    }

    renderLoggedUser() {
        const {currentUser} = this.context;
        const name = Users.getDisplayName(currentUser);
        const avatarUrl = Users.avatar.getUrl(currentUser);
        const updatedAt = moment(currentUser.postedAt).format("YYYY/MM/DD");

        return (
          <li className="dropdown user user-menu" id="right-user-menu">
              <a className="dropdown-toggle">
                  <div className="row">
                      <div className="col-lg-4">
                          {avatarUrl ?
                            <Telescope.components.AvatarBlurryImage
                              imageId={currentUser._id}
                              containerClass={"avatar"}
                              imageClass={"avatar-image avatar-image--icon"}
                              imageSet={{small: avatarUrl, large: avatarUrl}}
                              imageWidth={32}
                              imageHeight={32}
                              imageTitle={name}
                              isAvatar={true}
                            /> :
                            <img width="32" height="32" src="https://secure.gravatar.com/avatar/73e98f841e600f79ace2b600244cecc7?size=200&default=mm"/>}
                      </div>
                      <div className="col-lg-8">
                          <span className="hidden-xs">{name}</span>
                      </div>
                  </div>
              </a>
              <ul className="dropdown-menu">
                  <li className="user-header">
                      <img src="" className="img-circle" alt="User Image"/>
                      <p>
                          {name}
                          <small>Member since Nov. 2012</small>
                      </p>
                  </li>
                  <li className="user-footer">
                      <div className="pull-left">
                          <a className="btn btn-default btn-flat">Profile</a>
                      </div>
                      <div className="pull-right">
                          <a className="btn btn-default btn-flat">Sign out</a>
                      </div>
                  </li>
              </ul>
          </li>
        )
    }

    renderToggleSidebarIcon() {
        return (
          //admin-dashboard
          <a className="sidebar-toggle" id="sidebar-toggle" role="button" onClick={this.onToggleSidebarIconClick.bind(this)}>
              <span className="sr-only">Toggle navigation</span>
          </a>
        )
    }

    renderAdminbarLeft() {
        return (
          <ul id="wp-admin-bar-root-default" className="ab-top-menu">
              <li id="wp-admin-bar-site-name" className="menupop">
                  <a onClick={(e) => {
                      this.context.messages.pushRouter(this.props.router, {pathname: "/"});
                  }}
                     className="ab-item">
                      Politicl
                  </a>
              </li>
              <li id="wp-admin-bar-comments">
                  <a className="ab-item"
                     onClick={(e) => {
                         this.context.messages.appManagement.pushAdminSidebar(this.props.router, "comments");
                     }}
                  >
                      <span className="ab-icon">
                      </span>
                      <span id="ab-awaiting-mod"
                            className="ab-label awaiting-mod pending-count count-1">
                          1
                      </span>
                      <span className="screen-reader-text">
                          1 comment awaiting moderation
                      </span>
                  </a>
              </li>
          </ul>
        )
    }

    renderNew() {
        return (
          <li id="wp-admin-bar-new-content" className="menupop">
              <a className="ab-item"
              >
                  <span className="ab-icon">
                  </span>
                  <span className="ab-label">
                     New 
                  </span>
              </a>
              <div className="ab-sub-wrapper">
                  <ul id="wp-admin-bar-new-content-default" className="ab-submenu">
                      <li id="wp-admin-bar-new-post">
                          <a className="ab-item" href="http://localhost:8444/wp-admin/post-new.php">Post</a>
                      </li>
                      <li id="wp-admin-bar-new-user">
                          <a className="ab-item" href="http://localhost:8444/wp-admin/user-new.php">User</a>
                      </li>
                  </ul>
              </div>
          </li>
        )
    }

    renderAdminbarRight() {
        const {router} = this.props,
          {currentUser} = this.context,
          {my_account_hover} = this.state,
          name = Users.getDisplayName(currentUser),
          avatarUrl = Users.avatar.getUrl(currentUser);

        const myAccountClass = "menupop with-avatar" + (my_account_hover ? " hover" : "");
        return (
          <ul id="wp-admin-bar-top-secondary" className="ab-top-secondary ab-top-menu">
              <li id="wp-admin-bar-my-account" className={myAccountClass}
                  onMouseOut={(e) => {
                      this.setState({my_account_hover: false});
                  }
                  }
                  onMouseOver={(e) => {
                      this.setState({my_account_hover: true});
                  }
                  }
              >
                  <a className="ab-item">
                      {"Howdy, " + name}
                      <img alt=""
                           src={avatarUrl}
                           className="avatar avatar-26 photo" height="26" width="26"/>
                  </a>
                  <div className="ab-sub-wrapper">
                      <ul id="wp-admin-bar-user-actions" className="ab-submenu">
                          <li id="wp-admin-bar-user-info">
                              <a className="ab-item" onClick={(e) => {
                                  // user profile
                                  this.context.messages.pushRouter(this.props.router, Users.getLinkObject("profile", currentUser));
                              }}>
                                  <img alt=""
                                       src={avatarUrl}
                                       className="avatar avatar-64 photo"
                                       height="64"
                                       width="64"/>
                                  <span className="display-name">{name}</span>
                              </a>
                          </li>
                          <li id="wp-admin-bar-edit-profile">
                              <a className="ab-item"
                                 onClick={(e) => {
                                     this.context.messages.pushRouter(this.props.router, Users.getLinkObject("editing"));
                                 }}>
                                  Edit My Profile
                              </a>
                          </li>
                          <li id="wp-admin-bar-logout">
                              <a className="ab-item"
                                 onClick={(e) => {
                                     Meteor.logout(function () {
                                         router.replace({pathname: '/'});
                                     });
                                 }}>
                                  Log Out
                              </a>
                          </li>
                      </ul>
                  </div>
              </li>
          </ul>
        )
    }

    render() {
        return (
          <div id="wpadminbar">
              <div className="quicklinks" id="wp-toolbar" role="navigation">
                  {this.renderAdminbarLeft()}
                  {this.renderAdminbarRight()}
              </div>
              <a className="screen-reader-shortcut" href="http://localhost:8444/wp-login.php?action=logout&amp;_wpnonce=f334df5e37">Log Out</a>
          </div>
        )
    }

    renderxxx() {

        return (
          <header className="main-header">
              <a
                onClick={(e) => {
                    this.context.messages.pushRouter(this.props.router, {pathname: "/"});
                }}
                className="logo">
                    <span className="logo-mini">
                        <svg id="logo-mini-icon" width="26" height="26" viewBox="0 0 40 40">
                              <g fill="none">
                                  <path d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20" fill="#0a9fda"/>
                                  <path d="M22.667 20H17v-6h5.667c1.656 0 3 1.343 3 3s-1.344 3-3 3m0-10H13v20h4v-6h5.667c3.866 0 7-3.134 7-7s-3.134-7-7-7" fill="#FFF"/>
                              </g>
                          </svg>
                    </span>
                  <span className="logo-lg">
                      <span className="svgIcon svgIcon--logoNew svgIcon--45px is-flushLeft">
                          <img id="politicl-logo" width="68" height="22" src="/packages/public/images/politicl-logo-white.png"/>
                      </span>
                    </span>
              </a>
              <nav className="navbar navbar-static-top">
                  {this.renderToggleSidebarIcon()}

                  <Telescope.components.AppAdminHeaderUser/>
              </nav>
          </header>
        )
    }
}

AppAdminHeader.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

AppAdminHeader.displayName = "AppAdminHeader";

module.exports = withRouter(AppAdminHeader);
export default withRouter(AppAdminHeader);
