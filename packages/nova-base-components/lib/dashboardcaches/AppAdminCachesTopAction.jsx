import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import PoliticlCaches from "meteor/nova:politicl-caches";
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';


let numeral = require('numeral');

class AppAdminCachesTopAction extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            query: this.props.location.query.query ? this.props.location.query.query : ''
        };
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onSearchChange(event) {
        let value = event.target.value;
        this.setState({query: value});

        const appManagement = this.context.messages.appManagement;
        const {router} = this.props;
        this.context.messages.delayEvent(function () {
            appManagement.appendQuery(router, "query", value);
        }, 400);
    }

    onTopActionStatusClick(status) {
        this.setState({query: ""});
        this.props.toggleEvent();
        this.context.messages.appManagement.pushAdminFilterStatus(this.props.router, "caches", status);
    }

    getStatusRows() {
        let allCount = (this.props.allCount ? this.props.allCount : 0);
        const rows = [
            {title: "All", status: "all", count: allCount},
            {title: "Published", status: "publish", count: (this.props.publishCount ? this.props.publishCount : 0)},
        ];

        const countRows = [];
        _.forEach(rows, function (row) {
            countRows.push(row);
        });

        let length = countRows.length;

        let queryStatus = !!this.props.router.location.query.status ? this.props.router.location.query.status : "all";
        const statusRows = [];
        for (let i = 0; i < length; i++) {
            const row = countRows[i];
            statusRows.push(
              <li key={i} className={row.status}>
                  <a className={queryStatus == row.status ? "current" : ""}
                     onClick={this.onTopActionStatusClick.bind(this, row.status)}>{row.title + " "}
                      <span className="count">
                          {"(" + numeral(row.count).format('0,0') + ")" }
                      </span>
                  </a>
                  {(i < length - 1 ) ? <span>{" |"}</span> : null  }
              </li>)
        }

        return statusRows;
    }

    render() {

        const statusRows = this.getStatusRows();

        return (
          <div className="top-action-panel">
              <div className="col-sm-6">
                  <ul className="subsubsub">
                      {statusRows}
                  </ul>
              </div>
              <div className="col-sm-6">
                  <div id="example1_filter" className="dataTables_filter">
                      <label>
                          <input type="search"
                                 id="admin-posts-search"
                                 className="form-control input-sm admin-search-posts-input"
                                 placeholder="Search Caches"
                                 onChange={this.onSearchChange}
                                 value={this.state.query}/>
                      </label>
                  </div>
              </div>
          </div>
        )
    }

}

AppAdminCachesTopAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCachesTopAction.displayName = "AppAdminCachesTopAction";

module.exports = withRouter(AppAdminCachesTopAction);
export default withRouter(AppAdminCachesTopAction);
