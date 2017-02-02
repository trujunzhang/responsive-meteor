import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import PoliticlCaches from "meteor/nova:politicl-caches";
import {withRouter} from 'react-router';

let numeral = require('numeral');

class AppAdminCachesList extends Component {

    constructor(props) {
        super(props);

        const _rowState = this.resetSelectRowState(props.results);
        this.state = this.initialState = {
            // select all
            checkAll: false,
            rowState: _rowState,
            // pagination
            cachesPerPage: 10,
            dateSelector: this.props.location.query.date ? this.props.location.query.date : '0',
            // Edit
            editAll: false,
            editAllCallBack: null,
            editSingle: false,
            editSingleId: '',
        };

        this.onDateSelectorChange = this.onDateSelectorChange.bind(this);
        this.onCatSelectorChange = this.onCatSelectorChange.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.checkRow = this.checkRow.bind(this);
        this.onCachesActionEventClick = this.onCachesActionEventClick.bind(this);
        this.onRowItemActionEventClick = this.onRowItemActionEventClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const _rowState = this.resetSelectRowState(nextProps.results);

        this.setState({checkAll: false, rowState: _rowState})
    }

    resetSelectRowState(results) {
        let _rowState = [];
        if (!!results) {
            results.forEach(function (item) {
                _rowState.push({id: item._id, checked: false});
            });
        }

        return _rowState;
    }

    getCheckedIds() {
        const checkIds = [];
        this.state.rowState.forEach(function (item) {
            if (item.checked) {
                checkIds.push(item.id);
            }
        });
        return checkIds;
    }

    onCatSelectorChange(value) {
        this.context.messages.appManagement.appendQuery(this.props.router, "category", {slug: value});
    }

    checkRow(id, value) {
        let index = _.pluck(this.props.results, '_id').indexOf(id);
        let rowState = this.state.rowState;
        rowState[index].checked = value;
        let checkAll = false;
        if (this.state.checkAll) {
            checkAll = !this.state.checkAll;
        }
        this.setState({
            rowState: rowState,
            checkAll: checkAll
        });
    }

    checkAll() {
        let _rowState = [];
        let checkState = !this.state.checkAll;
        this.state.rowState.forEach(function (item) {
            _rowState.push({id: item.id, checked: checkState});
        });

        let _checkAll = checkState;

        this.setState({
            rowState: _rowState,
            checkAll: _checkAll
        });
    }

    unSelectAll() {
        let _rowState = [];
        let checkState = false;
        this.state.rowState.forEach(function (item) {
            _rowState.push({id: item.id, checked: checkState});
        });

        this.setState({
            rowState: _rowState,
            checkAll: checkState
        });
    }

    renderTableHeader() {
        return (
          <thead>
          <tr>
              <td id="cb" className="manage-column column-cb check-column">
                  <label className="screen-reader-text">Select All</label>
                  <input id="cb-select-all-1" type="checkbox" onChange={this.checkAll} checked={this.state.checkAll}/>
              </td>
              {/*<th scope="col" id="title" className="manage-column column-title column-primary sortable desc">*/}
              {/*<a>*/}
              {/*<span>Title</span>*/}
              {/*</a>*/}
              {/*</th>*/}
              <th scope="col" id="urlfrom" className="manage-column column-urlFrom">Url From</th>
              <th scope="col" id="url" className="manage-column column-url">url</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc">
                  <a>
                      <span>Date</span>
                  </a>
              </th>
          </tr>
          </thead>
        )
    }

    renderTableFooter() {
        return (
          <tfoot>
          <tr>
              <td className="manage-column column-cb check-column">
                  <label className="screen-reader-text">Select All</label>
                  <input id="cb-select-all-2" type="checkbox" onChange={this.checkAll} checked={this.state.checkAll}/>
              </td>
              {/*<th scope="col" className="manage-column column-title column-primary sortable desc">*/}
              {/*<a >*/}
              {/*<span>Title</span>*/}
              {/*</a>*/}
              {/*</th>*/}
              <th scope="col" id="urlfrom" className="manage-column column-urlfrom">Url From</th>
              <th scope="col" id="url" className="manage-column column-url">url</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc">
                  <a>
                      <span>Date</span>
                  </a>
              </th>
          </tr>
          </tfoot>

        )
    }

    onDateSelectorChange(event) {
        let value = event.target.value;
        this.setState({dateSelector: value});
        this.context.messages.appManagement.appendQuery(this.props.router, "date", value);
    }

    renderFilter() {
        const dateSelectors = PoliticlCaches.getDateSelectors();
        const dateOptions = [];
        dateOptions.push(<option key="20" selected="selected" value="0">All dates</option>);
        dateSelectors.map((item, index) => {
            dateOptions.push(<option key={index} value={item["query"]}>{item["title"]}</option>);
        });

        return (
          <div className="alignleft actions">
              <label className="screen-reader-text">Filter by date</label>
              <select name="m"
                      id="filter-by-date"
                      onChange={this.onDateSelectorChange}
                      value={this.state.dateSelector}>
                  {dateOptions}
              </select>
          </div>
        )
    }

    onCachesActionEventClick(type, cb) {
        this.actionEvent(type, this.getCheckedIds(), null, cb);
    }

    onRowItemActionEventClick(type, item) {
        let self = this;
        this.actionEvent(type, [item._id], item, function (error, result) {
            self.onToggleEvent();
        });
    }

    actionEvent(type, itemIds, item, cb) {
        switch (type) {
            case "bulk-edit":
                if (itemIds.length > 0) {
                    this.setState({editAll: true, editAllCallBack: cb, editSingle: false, editSingleId: ''});
                }
                break;
            case "edit":
                this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {admin: true, action: "edit", editId: item._id}});
                break;
            case "quick_edit":
                this.setState({editAll: false, editAllCallBack: null, editSingle: true, editSingleId: item._id});
                break;
            case "preview":
                this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {cacheId: item._id, title: item.slug}});
                break;
            case "trash":
                this.context.actions.call('caches.move.to.trash', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "restore":
                this.context.actions.call('caches.restore.to.last.status', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "delete_permanently":
                const deleteFolderConfirm = "Are you sure you want to delete this item? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(deleteFolderConfirm)) {
                    this.context.actions.call('caches.delete.permanently', itemIds, (error, result) => {
                        cb(error, result);
                    });
                }
                break;
        }
    }

    renderTopbar() {
        const tableCount = !!this.props.tableCount ? this.props.tableCount : 0;

        return (
          <div className="tablenav top">

              <Telescope.components.AppAdminCachesAction actionEvent={this.onCachesActionEventClick}/>
              {this.renderFilter()}

              <h2 className="screen-reader-text">Caches list navigation</h2>
              {tableCount > 0 ?
                <Telescope.components.PaginationContainer
                  tableCount={tableCount}
                  countPerPage={this.state.cachesPerPage}/>
                : null}
              <br className="clear"/>

          </div>
        )
    }

    renderButtonbar() {
        const tableCount = PoliticlCaches.getTotalCount(this.props, this.props.location.query.status);

        return (
          <div className="tablenav bottom">

              <Telescope.components.AppAdminCachesAction actionEvent={this.onCachesActionEventClick}/>

              <div className="alignleft actions"></div>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.cachesPerPage}
              />
              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(cache, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminCacheItem
            key={index}
            index={index}
            cache={cache}
            actionEvent={this.onRowItemActionEventClick}
            checked={checked}
            checkRow={this.checkRow}/>
        )
    }

    onBulkEditAllHook(error, result) {
        this.setState({editAll: false});
        this.unSelectAll();
        this.state.editAllCallBack(error, result);
    }

    onBulkEditCancelClick() {
        this.setState({editAll: false});
    }

    onSingleEditCancelClick(error, result) {
        this.setState({editSingle: false, editSingleId: ''});
    }

    onSingleEditHook() {
        this.setState({editSingle: false, editSingleId: ''});
    }

    renderTableRows() {
        const results = (!!this.props.results && this.props.results.length > 0 ) ? this.props.results : [];
        if (results.length == 0) {
            return (
              <tbody id="the-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No caches found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        results.map((item, index) => {
            rows.push(this.renderTableRow(item, index));
        });

        return (
          <tbody id="the-list">
          {rows}
          </tbody>
        )
    }

    renderLoading() {
        return (
          <tbody id="the-list">
          <tr>
              <td>
                  <div className="admin-table-loading">
                      <span className="loading_2hQxH subtle_1BWOT">
                          <div className={"post-loadmore-spinner"}>
                              <span>{"Loading"}</span>
                              <div className="bounce1"></div>
                              <div className="bounce2"></div>
                              <div className="bounce3"></div>
                          </div>
                      </span>
                  </div>

              </td>
          </tr>
          </tbody>
        )
    }

    onToggleEvent() {
        this.setState({editAll: false, editAllCallBack: null, editSingle: false, editSingleId: '', dateSelector: '0'});
    }

    onSubmitAnArticleClick() {
        this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {action: "new"}});
    }

    render() {
        return (
          <div className="wrap" id="admin-posts-ui">
              <h1 className="admin-caches-title">
                  Caches
                  <Telescope.components.AppSearchTitle/>
              </h1>

              <Telescope.components.AppAdminCachesTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

              {this.renderTopbar()}
              <table className="wp-list-table widefat fixed striped caches">

                  {this.renderTableHeader()}

                  {!this.props.ready ? this.renderLoading() : this.renderTableRows()}

                  {this.renderTableFooter()}
              </table>

              {this.renderButtonbar()}
          </div>
        )

    }
}

AppAdminCachesList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCachesList.displayName = "AppAdminCachesList";

module.exports = withRouter(AppAdminCachesList);
export default withRouter(AppAdminCachesList);
