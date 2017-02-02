import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Topics from "meteor/nova:topics";
import {withRouter} from 'react-router';


let numeral = require('numeral');

class AppAdminTopicsList extends Component {

    constructor(props) {
        super(props);

        const _rowState = this.resetSelectRowState(props.results);
        this.state = this.initialState = {
            // select all
            checkAll: false,
            rowState: _rowState,
            // pagination
            postsPerPage: 10,
            dateSelector: 'All dates',
            // Edit
            editAll: false,
            editAllCallBack: null,
            editSingle: false,
            editSingleId: '',
        };

        this.checkAll = this.checkAll.bind(this);
        this.checkRow = this.checkRow.bind(this);
        this.onPostsActionEventClick = this.onPostsActionEventClick.bind(this);
        this.onRowItemActionEventClick = this.onRowItemActionEventClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const _rowState = this.resetSelectRowState(nextProps.results);

        this.setState({checkAll: false, rowState: _rowState})
    }

    resetSelectRowState(results) {
        let _rowState = [];
        if (!!results) {
            results.forEach(function (post) {
                _rowState.push({id: post._id, checked: false});
            });
        }

        return _rowState;
    }

    getCheckedTopicIds() {
        const postIds = [];
        this.state.rowState.forEach(function (item) {
            if (item.checked) {
                postIds.push(item.id);
            }
        });
        return postIds;
    }

    checkRow(id, value) {
        let rowState = this.state.rowState;
        rowState[id].checked = value;
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

        this.setState({
            rowState: _rowState,
            checkAll: checkState
        });
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

    onSingleEditCancelClick(error, result) {
        this.setState({editSingle: false, editSingleId: ''});
    }

    onSingleEditHook() {
        this.setState({editSingle: false, editSingleId: ''});
    }

    onPostsActionEventClick(type, cb) {
        this.actionEvent(type, this.getCheckedIds(), null, cb);
    }

    onRowItemActionEventClick(type, topic) {
        let self = this;
        this.actionEvent(type, [topic._id], topic, function (error, result) {
            self.onToggleEvent();
        });
    }

    onToggleEvent() {
        this.setState({editAll: false, editSingle: false, editSingleId: ''});
    }

    actionEvent(type, topicIds, topic, cb) {
        switch (type) {
            case "quick_edit":
                this.setState({editSingle: true, editSingleId: topic._id});
                break;
            case "trash":
                this.context.actions.call('topics.move.to.trash', topicIds, (error, result) => {
                });
                break;
            case "filter":
                this.context.actions.call('topics.filter.in.trending', topicIds, (error, result) => {
                });
                break;
            case "filter_restore":
                this.context.actions.call('topics.filter.restore', topicIds, (error, result) => {
                });
                break;
            case "restore":
                this.context.actions.call('topics.move.to.approved', topicIds, (error, result) => {
                });
                break;
            case "delete_permanently":
                const deleteFolderConfirm = "Are you sure you want to delete this topic? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(deleteFolderConfirm)) {
                    this.context.actions.call('topics.delete', topicIds, (error, result) => {
                    });
                }
                break;
            case "publish":
                this.context.actions.call('topics.move.to.published', topicIds, (error, result) => {
                });
                break;
        }
    }

    renderTableHeader() {
        return (
          <thead>
          <tr>
              <td id="cb" className="manage-column column-cb check-column">
                  <label className="screen-reader-text">Select All</label>
                  <input id="cb-select-all-1" type="checkbox" onChange={this.checkAll} checked={this.state.checkAll}/>
              </td>
              <th scope="col" id="title" className="manage-column column-title column-primary sortable desc">
                  <a href="http://www.politicl.com/wp-admin/edit.php?mode=list&amp;orderby=title&amp;order=asc">
                      <span>Name</span>
                  </a>
              </th>
              <th scope="col" id="author" className="manage-column column-slug">Slug</th>
              <th scope="col" id="categories" className="manage-column column-count">Count</th>
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
                  <input id="cb-select-all-1" type="checkbox" onChange={this.checkAll} checked={this.state.checkAll}/>
              </td>
              <th scope="col" className="manage-column column-title column-primary sortable desc">
                  <a >
                      <span>Name</span>
                  </a>
              </th>
              <th scope="col" id="author" className="manage-column column-slug">Slug</th>
              <th scope="col" id="categories" className="manage-column column-count">Count</th>
          </tr>
          </tfoot>
        )
    }

    renderTopbar() {
        const tableCount = Topics.getTotalCount(this.props, this.props.location.query.status);

        return (
          <div className="tablenav top">

              <Telescope.components.AppAdminTopicsAction actionEvent={this.onPostsActionEventClick}/>

              <h2 className="screen-reader-text">Topics list navigation</h2>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderButtonbar() {
        const tableCount = Topics.getTotalCount(this.props, this.props.location.query.status);

        return (
          <div className="tablenav bottom">

              <Telescope.components.AppAdminPostsAction actionEvent={this.onPostsActionEventClick}/>

              <h2 className="screen-reader-text">Topics list navigation</h2>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderTopicsEditSingle(rows, topic) {
        if (this.state.editSingle && this.state.editSingleId == topic._id) {
            rows.push(
              <Telescope.components.AppAdminTopicsEditSingle
                onEditSingleCancelClick={this.onSingleEditCancelClick.bind(this)}
                editSingleHook={this.onSingleEditHook.bind(this)}
                topic={topic}/>
            );
            return true;
        }
        return false;
    }

    renderTableRow(topic, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminTopicItem
            key={index}
            index={index}
            topic={topic}
            checked={checked}
            callback={this.checkRow}
            actionEvent={this.onRowItemActionEventClick}/>
        )
    }

    renderTableRows() {
        const topics = (!!this.props.results && this.props.results.length > 0 ) ? this.props.results : [];
        if (topics.length == 0) {
            return (
              <tbody id="the-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No topics found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        topics.map((item, index) => {
            let haveEdit = this.renderTopicsEditSingle(rows, item);
            if (!haveEdit) {
                rows.push(this.renderTableRow(item, index));
            }
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

    render() {
        return (
          <div className="wrap" id="admin-posts-ui">
              <h1 className="admin-posts-title">
                  Topics
                  <Telescope.components.AppSearchTitle/>
              </h1>


              <Telescope.components.AppAdminTopicsTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

              {this.renderTopbar()}
              <table className="wp-list-table widefat fixed striped posts">

                  {this.renderTableHeader()}

                  {!this.props.ready ? this.renderLoading() : this.renderTableRows()}

                  {this.renderTableFooter()}
              </table>

              {this.renderButtonbar()}
          </div>
        )

    }
}

AppAdminTopicsList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

AppAdminTopicsList.displayName = "AppAdminTopicsList";

module.exports = withRouter(AppAdminTopicsList);
export default withRouter(AppAdminTopicsList);
