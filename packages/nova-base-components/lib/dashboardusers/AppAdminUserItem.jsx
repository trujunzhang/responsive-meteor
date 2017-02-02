import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminUserItem extends Component {
    onUserCountClick() {
        const {user,router} = this.props,
        displayName = Users.getDisplayName(user);
        this.context.messages.pushNewLocationPathWithTitle(router,
                                                           {pathname: "/", query: {admin: true, userId: user._id}},
                                                           displayName);
    }

    checkIt() {
        this.props.callback(this.props.index, !this.props.checked);
    }

    render() {
        const {user} = this.props;

        const userName = Users.getUserName(user),
              displayName = Users.getDisplayName(user),
              email = Users.getUserEmail(user),
              role = Users.getRole(user),
              loginType = Users.getLoginType(user),
              createdAt = moment(user.createdAt).format("YYYY/MM/DD"),
              counterKeyName = Users.getCounterKeyName(),
              count = user[counterKeyName] ? user[counterKeyName] : '-';

        const avatarObj = Users.getAvatarObj(user);

        return (
          <tr key={user._id}>
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select " + displayName}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              <td className="username column-username has-row-actions column-primary">
                  <img alt=""
                       src={avatarObj.url}
                       className="avatar avatar-32 photo"
                       height="32" width="32"/>
                  <strong>{!!userName ? userName : "-" }</strong>
                  <Telescope.components.AppAdminUserItemAction actionEvent={this.props.actionEvent} user={user}/>
              </td>
              <td className="name column-name">
                  <strong>{displayName}</strong>
              </td>
              <td className="email column-email">
                  <Telescope.components.MailTo email={email}/>
              </td>
              <td className="role column-role">
                  <strong>{role}</strong>
              </td>
              <td className="comments column-loginType">
                  <strong>{loginType}</strong>
              </td>
              <td className="posts column-posts num">
                  <strong>
                      <a onClick={this.onUserCountClick.bind(this)}>{count}</a>
                  </strong>
              </td>
              <td className="date column-date">Created At<br/>
                  <abbr title={createdAt}>{createdAt}</abbr>
              </td>
          </tr>
        )
    }

}

AppAdminUserItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminUserItem.displayName = "AppAdminUserItem";

module.exports = withRouter(AppAdminUserItem);
export default withRouter(AppAdminUserItem);
