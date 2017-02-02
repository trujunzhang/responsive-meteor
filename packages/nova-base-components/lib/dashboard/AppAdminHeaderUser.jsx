import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router'
import moment from 'moment';

class AppAdminHeaderUser extends Component {

    constructor(props) {
        super(props);
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

    render() {
        const {currentUser} = this.context;
        const name = Users.getDisplayName(currentUser);
        const avatarUrl = Users.avatar.getUrl(currentUser);

        return (
          <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                  {/*<li className="dropdown notifications-menu">*/}
                  {/*<a className="dropdown-toggle">*/}
                  {/*<i className="fa fa-bell-o"></i>*/}
                  {/*<span className="label label-warning">10</span>*/}
                  {/*</a>*/}
                  {/*</li>*/}
                  <li className="dropdown user user-menu">
                      <a className="dropdown-toggle">
                          <img src={avatarUrl} className="user-image" alt="User Image"/>
                          <span className="hidden-xs">{name}</span>
                      </a>
                  </li>
              </ul>
          </div>
        )
    }
}

AppAdminHeaderUser.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

AppAdminHeaderUser.displayName = "AppAdminHeaderUser";

module.exports = withRouter(AppAdminHeaderUser);
export default withRouter(AppAdminHeaderUser);
