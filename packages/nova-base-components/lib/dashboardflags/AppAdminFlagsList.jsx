import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "meteor/nova:categories";
import {withRouter} from 'react-router';

class AppAdminFlagsList extends Component {

    constructor(props) {
        super(props);

        const _rowState = this.resetSelectRowState(props.results);
        this.state = this.initialState = {
            // select all
            checkAll: false,
            rowState: _rowState,
            // pagination
            postsPerPage: 10,
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
        this.onFlagsActionEventClick = this.onFlagsActionEventClick.bind(this);
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
              <th scope="col" className="manage-column column-title column-primary sortable desc"><a><span>Post Title</span></a></th>
              <th scope="col" className="manage-column column-curator sortable desc"><a><span>Post Author</span></a></th>
              <th scope="col" id="reason" className="manage-column column-reason">Reason</th>
              <th scope="col" id="flager" className="manage-column column-flager">Reporter</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc"><a><span>Flaged On</span></a></th>
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
              <th scope="col" className="manage-column column-title column-primary sortable desc"><a><span>Post Title</span></a></th>
              <th scope="col" className="manage-column column-curator sortable desc"><a><span>Post Author</span></a></th>
              <th scope="col" className="manage-column column-reason">Reason</th>
              <th scope="col" className="manage-column column-flager">Reporter</th>
              <th scope="col" className="manage-column column-date sorted desc"><a><span>Flaged On</span></a></th>
          </tr>
          </tfoot>
        )
    }

    onApproveListClick() {
        let query = _.clone(this.props.location.query);
        this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {...query, admin: true}});
    }

    onDateSelectorChange(event) {
        let value = event.target.value;
        this.setState({dateSelector: value});
        this.context.messages.appManagement.appendQuery(this.props.router, "date", value);
    }

    renderFilter() {
        const dateSelectors = Posts.getDateSelectors();
        const dateOptions = [];
        dateOptions.push(<option key="20" selected="selected" value="0">All dates</option>);
        dateSelectors.map((item, index) => {
            dateOptions.push(<option key={index} value={item["query"]}>{item["title"]}</option>);
        });

        return (
          <div className="alignleft actions">
              <label className="screen-reader-text">Filter by date</label>
              <select name="m" id="filter-by-date" onChange={this.onDateSelectorChange} value={this.state.dateSelector}>
                  {dateOptions}
              </select>
              <label className="screen-reader-text">Filter by category</label>
              <Telescope.components.AdminListContainer
                collection={Categories}
                limit={0}
                component={Telescope.components.AppAdminCategoriesSelector}
                componentProps={{onChange: this.onCatSelectorChange}}
                listId={"admin.posts.categories.list"}
              />
              <input type="submit"
                     name="filter_action"
                     id="post-query-submit"
                     onClick={this.onApproveListClick.bind(this)}
                     className="button"
                     value="Approving"/>
          </div>
        )
    }

    onFlagsActionEventClick(type, cb) {
        this.actionEvent(type, this.getCheckedIds(), null, cb);
    }

    onRowItemActionEventClick(type, flag) {
        let self = this;
        this.actionEvent(type, [flag._id], flag, function (error, result) {
            self.onToggleEvent();
        });
    }

    actionEvent(type, itemIds, flag, cb) {
        const post = !!flag ? flag.post : null;
        switch (type) {
            case "public":
                this.context.actions.call('posts.approving.status',
                  post._id, Posts.config.STATUS_APPROVED,
                  (error, result) => {
                      cb(error, result);
                  });
                break;
            case "unpublic":
                this.context.actions.call('posts.approving.status',
                  post._id, Posts.config.STATUS_REJECTED,
                  (error, result) => {
                      cb(error, result);
                  });
                break;
            case "edit":
                Users.openNewWindow("/",
                  {action: "edit", editId: post._id, admin: true}
                );
                break;
            case "preview":
                Users.openNewWindow("/",
                  {postId: post._id, title: post.slug, admin: true}
                );
                break;
            case "delete_all":
                const
                  _deleteFolderConfirm = "Are you sure you want to delete this ? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(_deleteFolderConfirm)) {
                    this.context.actions.call('posts.delete.permanently', [post._id], (error, result) => {
                        if (!!error) {
                            this.context.messages.flash('Remove post failure', "error");
                        } else {
                            this.context.actions.call('flags.remove', itemIds, (error, result) => {
                                cb(error, result);
                            });
                        }
                    });
                }
                break;
            case "delete_permanently":
                const deleteFolderConfirm = "Are you sure you want to delete this flag? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(deleteFolderConfirm)) {
                    this.context.actions.call('flags.remove', itemIds, (error, result) => {
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

              <Telescope.components.AppAdminFlagsAction actionEvent={this.onFlagsActionEventClick}/>
              {this.renderFilter()}

              <h2 className="screen-reader-text">Flags list navigation</h2>
              {tableCount > 0 ?
                <Telescope.components.PaginationContainer
                  tableCount={tableCount}
                  countPerPage={this.state.postsPerPage}/>
                : null}
              <br className="clear"/>

          </div>
        )
    }

    renderButtonbar() {
        const tableCount = Posts.getTotalCount(this.props, this.props.location.query.status);

        return (
          <div className="tablenav bottom">

              <Telescope.components.AppAdminFlagsAction actionEvent={this.onFlagsActionEventClick}/>

              <div className="alignleft actions"></div>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />
              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(flag, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminFlagItem
            key={index}
            index={index}
            flag={flag}
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

    renderFlagsEditAll() {
        if (this.state.editAll) {
            const itemIds = this.getCheckedIds();
            const selectedFlags = [];
            _.forEach(this.props.results, function (post) {
                if (itemIds.indexOf(post._id) > -1)
                    selectedFlags.push(post);
            });

            return (
              <Telescope.components.AppAdminFlagsEditAll
                onBulkEditCancelClick={this.onBulkEditCancelClick.bind(this)}
                editAllHook={this.onBulkEditAllHook.bind(this)}
                checkRow={this.checkRow}
                posts={selectedFlags}/>
            )
        }
        return null;
    }

    renderFlagsEditSingle(rows, post) {
        if (this.state.editSingle && this.state.editSingleId == post._id) {
            rows.push(
              <Telescope.components.AppAdminFlagsEditSingle
                onEditSingleCancelClick={this.onSingleEditCancelClick.bind(this)}
                editSingleHook={this.onSingleEditHook.bind(this)}
                post={post}/>
            );
            return true;
        }
        return false;
    }

    renderTableRows() {
        const results = (!!this.props.results && this.props.results.length > 0 ) ? this.props.results : [];
        if (results.length == 0) {
            return (
              <tbody id="the-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No flags found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        results.map((item, index) => {
            let haveEdit = this.renderFlagsEditSingle(rows, item);
            if (!haveEdit) {
                rows.push(this.renderTableRow(item, index));
            }
        });

        return (
          <tbody id="the-list">
          {this.renderFlagsEditAll()}
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
        if (!!this.state.editAllCallBack) {
            this.state.editAllCallBack(null, null);
        }

        this.setState({editAll: false, editAllCallBack: null, editSingle: false, editSingleId: '', dateSelector: '0'});
    }

    onSubmitAnArticleClick() {
        this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {action: "new"}});
    }

    render() {
        return (
          <div className="wrap" id="admin-posts-ui">
              <h1 className="admin-posts-title">
                  Reported Posts
                  <Telescope.components.AppSearchTitle/>
              </h1>

              <Telescope.components.AppAdminFlagsTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

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

AppAdminFlagsList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminFlagsList.displayName = "AppAdminFlagsList";

module.exports = withRouter(AppAdminFlagsList);
export default withRouter(AppAdminFlagsList);
