import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import {withRouter} from 'react-router';


let numeral = require('numeral');

class PaginationContainer extends Component {

    constructor(props) {
        super(props);

        const current = this.getCurrentPage();
        this.state = this.initialState = {
            currentPage: current,
        };
    }

    setRouterPagedValue(newPaged) {
        this.setState({"currentPage": newPaged});
        this.context.messages.appManagement.appendQuery(this.props.router, "paged", newPaged);
    }

    onCurrentPageChange(e) {
        const totalPages = this.getTotalPages();
        const value = Math.min(e.target.value, totalPages);
        this.setState({"currentPage": value});

        const appManagement = this.context.messages.appManagement;
        const router = this.props.router;

        this.context.messages.delayEvent(function () {
            appManagement.appendQuery(router, "paged", value);
        }, 400);
    }

    getTotalPages() {
        const tableCount = this.props.tableCount ? this.props.tableCount : 0;
        const totoalPage = Math.floor(tableCount / this.props.countPerPage) + 1;
        return Math.max(totoalPage, 1);
    }

    getCurrentPage() {
        if (!!this.props.router.location.query && this.props.router.location.query.paged) {
            var paged = this.props.router.location.query.paged;
            return parseInt(paged);
        }
        return 1;
    }

    onFirstPageClick() {
        this.setRouterPagedValue(1);
    }

    onLastPageClick() {
        const totalPages = this.getTotalPages();
        if (totalPages == 0) {
            return;
        }
        this.setRouterPagedValue(totalPages);
    }

    onPreviousPageClick() {
        const currentPage = this.getCurrentPage();
        const previousPage = Math.max(currentPage - 1, 1);

        this.setRouterPagedValue(previousPage);
    }

    onNextPageClick() {
        const totalPages = this.getTotalPages();
        if (totalPages == 0) {
            return;
        }

        const currentPage = this.getCurrentPage();
        let nextPage = currentPage + 1;
        nextPage = Math.min(nextPage, totalPages);
        this.setRouterPagedValue(nextPage);
    }

    renderFirstArrow() {
        const currentPage = this.getCurrentPage();

        if (currentPage <= 2) {
            return (
              <span className="tablenav-pages-navspan" onClick={this.onFirstPageClick.bind(this)}>«</span>
            )
        }
        return (
          <a className="prev-page" onClick={this.onFirstPageClick.bind(this)}>
              <span className="screen-reader-text">Previous page</span>
              <span >«</span>
          </a>
        )
    }

    renderPreviousArrow() {
        const currentPage = this.getCurrentPage();

        if (currentPage == 1) {
            return (
              <span className="tablenav-pages-navspan" onClick={this.onPreviousPageClick.bind(this)}>‹</span>
            )
        }
        return (
          <a className="prev-page" onClick={this.onPreviousPageClick.bind(this)}>
              <span className="screen-reader-text">Previous page</span>
              <span >‹</span>
          </a>
        )
    }

    renderNextArrow() {
        const currentPage = this.getCurrentPage();
        const totalPages = this.getTotalPages();

        if (currentPage == totalPages) {
            return (
              <span className="tablenav-pages-navspan">›</span>
            )
        }
        return (
          <a className="next-page" onClick={this.onNextPageClick.bind(this)}>
              <span className="screen-reader-text">Next page</span>
              <span >›</span>
          </a>
        )
    }

    renderLastArrow() {
        const currentPage = this.getCurrentPage();
        const totalPages = this.getTotalPages();

        if (currentPage >= totalPages - 1) {
            return (
              <span className="tablenav-pages-navspan">»</span>
            )
        }
        return (
          <a className="last-page" onClick={this.onLastPageClick.bind(this)}>
              <span className="screen-reader-text">Last page</span>
              <span >»</span>
          </a>
        )
    }

    render() {
        const tableCount = this.props.tableCount ? this.props.tableCount : 0;
        const currentPage = this.getCurrentPage();
        const totalPages = this.getTotalPages();

        return (
          <div className="tablenav-pages">
              <span className="displaying-num">{numeral(tableCount).format('0,0') + ' items'}</span>
              <span className="pagination-links">
                  {this.renderFirstArrow()}
                  {this.renderPreviousArrow()}

                  <span className="paging-input">
                      <label className="screen-reader-text">Current Page</label>
                      <input
                        className="current-page"
                        id="current-page-selector"
                        type="text"
                        name="paged"
                        value={this.state.currentPage}
                        onChange={this.onCurrentPageChange.bind(this)}
                        size="4"/>
                      <span className="tablenav-paging-text">
                                of
                          <span className="total-pages">{totalPages}</span>
                      </span>
                  </span>

                  {this.renderNextArrow()}
                  {this.renderLastArrow()}
              </span>
          </div>
        )
    }
}

PaginationContainer.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

PaginationContainer.displayName = "PaginationContainer";

module.exports = withRouter(PaginationContainer);
export default withRouter(PaginationContainer);
