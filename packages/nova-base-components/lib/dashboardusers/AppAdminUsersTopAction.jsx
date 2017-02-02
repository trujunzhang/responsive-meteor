import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';
let numeral = require('numeral');

class AppAdminUsersTopAction extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            query: this.props.location.query.query ? this.props.location.query.query : '',
        };
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onSearchChange(event) {
        let value = event.target.value;
        this.setState({query: value});

        const appManagement = this.context.messages.appManagement;
        const router = this.props.router;
        this.context.messages.delayEvent(function () {
            appManagement.appendQuery(router, "query", value);
        }, 400);
    }

    onTopActionloginClick(login) {
        this.props.toggleEvent();
        this.context.messages.appManagement.pushUserStatus(this.props.router, "users", login);
    }

    getLoginRows() {
        const adminCount = this.props.adminCount ? this.props.adminCount : 0;
        const twitterCount = this.props.twitterCount ? this.props.twitterCount : 0;
        const facebookCount = this.props.facebookCount ? this.props.facebookCount : 0;
        const passwordlessCount = this.props.passwordlessCount ? this.props.passwordlessCount : 0;

        const allCount = twitterCount + facebookCount + passwordlessCount;
        if ((allCount ) == 0) {
            return null;
        }
        const rows = [
            {title: "All", login: "all", count: allCount},
            {title: "administrator", login: "admin", count: adminCount},
            {title: "Twitter", login: "twitter", count: twitterCount},
            {title: "Facebook", login: "facebook", count: facebookCount},
            {title: "Passwordless", login: "passwordless", count: passwordlessCount},
        ];

        const countRows = [];
        _.forEach(rows, function (row) {
            if (row.count != 0 || row.title == "All") {
                countRows.push(row);
            }
        });

        let length = countRows.length;

        let querylogin = !!this.props.router.location.query.login ? this.props.router.location.query.login : "all";
        const loginRows = [];
        for (let i = 0; i < length; i++) {
            const row = countRows[i];
            loginRows.push(
              <li key={i} className={row.login}>
                  <a className={querylogin == row.login ? "current" : ""}
                     onClick={this.onTopActionloginClick.bind(this, row.login)}>
                      {row.title + " "}
                      <span className="count">
                          {"(" + numeral(row.count).format('0,0') + ")" }
                      </span>
                  </a>
                  {(i < length - 1 ) ? <span>{" |"}</span> : null  }
              </li>)
        }

        return loginRows;
    }

    render() {
        const loginRows = this.getLoginRows();

        return (
          <div className="top-action-panel">
              <div className="col-sm-6">
                  <ul className="subsubsub">
                      {loginRows}
                  </ul>
              </div>
              <div className="col-sm-6">
                  <div id="example1_filter" className="dataTables_filter">
                      <label>
                          <input type="search"
                                 className="form-control input-sm admin-search-posts-input"
                                 placeholder="Search Users"
                                 onChange={this.onSearchChange}
                                 value={this.state.query}/>
                      </label>
                  </div>
              </div>
          </div>
        )
    }

}

AppAdminUsersTopAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

AppAdminUsersTopAction.displayName = "AppAdminUsersTopAction";

module.exports = withRouter(AppAdminUsersTopAction);
export default withRouter(AppAdminUsersTopAction);
