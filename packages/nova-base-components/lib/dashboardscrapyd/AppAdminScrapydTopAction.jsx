import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import {withRouter} from 'react-router';


let numeral = require('numeral');

class AppAdminScrapydTopAction extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {};
    }

    onTopActionStatusClick(status) {
        this.setState({query: ""});
        this.props.toggleEvent();
        this.context.messages.appManagement.pushAdminFilterStatus(this.props.router, "scrapyd", status);
    }

    getStatusRows() {
        let itemCount = (this.props.itemCount ? this.props.itemCount : 0);
        const rows = [
            {title: "Politicl", status: "items", count: itemCount},
            {title: "Pagination", status: "pagination", count: (this.props.paginationCount ? this.props.paginationCount : 0)},
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
          </div>
        )
    }

}

AppAdminScrapydTopAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminScrapydTopAction.displayName = "AppAdminScrapydTopAction";

module.exports = withRouter(AppAdminScrapydTopAction);
export default withRouter(AppAdminScrapydTopAction);
