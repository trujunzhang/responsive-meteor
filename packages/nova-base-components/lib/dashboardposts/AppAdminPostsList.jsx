import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Categories from "meteor/nova:categories";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class AppAdminPostsList extends Component {

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
              <th scope="col" id="title" className="manage-column column-title column-primary sortable desc"><a><span>Title</span></a></th>
              <th scope="col" id="source" className="manage-column column-source">Source Name</th>
              <th scope="col" id="curator" className="manage-column column-curator">Curator</th>
              <th scope="col" id="categories" className="manage-column column-categories">Categories</th>
              <th scope="col" id="topics" className="manage-column column-topics">Topics</th>
              <th scope="col" id="comments" className="manage-column column-comments num sortable desc">Comments</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc"><a><span>Date</span></a></th>
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
              <th scope="col" className="manage-column column-title column-primary sortable desc"><a><span>Title</span></a></th>
              <th scope="col" className="manage-column column-source">Source Name</th>
              <th scope="col" className="manage-column column-curator">Curator</th>
              <th scope="col" className="manage-column column-categories">Categories</th>
              <th scope="col" className="manage-column column-topics">Topics</th>
              <th scope="col" className="manage-column column-comments num sortable desc">Comments</th>
              <th scope="col" className="manage-column column-date sorted desc"><a><span>Date</span></a></th>
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

    onPostsActionEventClick(type, cb) {
        this.actionEvent(type, this.getCheckedIds(), null, cb);
    }

    onRowItemActionEventClick(type, post) {
        let self = this;
        this.actionEvent(type, [post._id], post, function (error, result) {
            self.onToggleEvent();
        });
    }

    actionEvent(type, itemIds, post, cb) {
        switch (type) {
            case "bulk-edit":
                if (itemIds.length > 0) {
                    this.setState({editAll: true, editAllCallBack: cb, editSingle: false, editSingleId: ''});
                }
                break;
            case "edit":
                Users.openNewWindow("/",
                  {action: "edit", editId: post._id, admin: true}
                );
                break;
            case "quick_edit":
                this.setState({editAll: false, editAllCallBack: null, editSingle: true, editSingleId: post._id});
                break;
            case "preview":
                Users.openNewWindow("/",
                  {postId: post._id, title: post.slug, admin: true}
                );
                break;
            case "trash":
                this.context.actions.call('posts.move.to.trash', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "restore":
                this.context.actions.call('posts.restore.to.last.status', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "delete_permanently":
                const deleteFolderConfirm = "Are you sure you want to delete this post? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(deleteFolderConfirm)) {
                    this.context.actions.call('posts.delete.permanently', itemIds, (error, result) => {
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

              <Telescope.components.AppAdminPostsAction actionEvent={this.onPostsActionEventClick}/>
              {this.renderFilter()}

              <h2 className="screen-reader-text">Posts list navigation</h2>
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

              <Telescope.components.AppAdminPostsAction actionEvent={this.onPostsActionEventClick}/>

              <div className="alignleft actions"></div>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />
              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(post, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminPostItem
            key={index}
            index={index}
            post={post}
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

    renderPostsEditAll() {
        if (this.state.editAll) {
            const itemIds = this.getCheckedIds();
            const selectedPosts = [];
            _.forEach(this.props.results, function (post) {
                if (itemIds.indexOf(post._id) > -1)
                    selectedPosts.push(post);
            });

            return (
              <Telescope.components.AppAdminPostsEditAll
                onBulkEditCancelClick={this.onBulkEditCancelClick.bind(this)}
                editAllHook={this.onBulkEditAllHook.bind(this)}
                checkRow={this.checkRow}
                posts={selectedPosts}/>
            )
        }
        return null;
    }

    renderPostsEditSingle(rows, post) {
        if (this.state.editSingle && this.state.editSingleId == post._id) {
            rows.push(
              <Telescope.components.AppAdminPostsEditSingle
                onEditSingleCancelClick={this.onSingleEditCancelClick.bind(this)}
                editSingleHook={this.onSingleEditHook.bind(this)}
                post={post}/>
            );
            return true;
        }
        return false;
    }

    renderTableRows() {
        const posts = (!!this.props.results && this.props.results.length > 0 ) ? this.props.results : [];
        if (posts.length == 0) {
            return (
              <tbody id="the-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No posts found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        posts.map((item, index) => {
            let haveEdit = this.renderPostsEditSingle(rows, item);
            if (!haveEdit) {
                rows.push(this.renderTableRow(item, index));
            }
        });

        return (
          <tbody id="the-list">
          {this.renderPostsEditAll()}
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
              <h1 className="admin-posts-title">Posts
                  <a onClick={this.onSubmitAnArticleClick.bind(this)} className="page-title-action">Add New</a>
                  <Telescope.components.AppSearchTitle/>
              </h1>

              <Telescope.components.AppAdminPostsTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

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

AppAdminPostsList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminPostsList.displayName = "AppAdminPostsList";

module.exports = withRouter(AppAdminPostsList);
export default withRouter(AppAdminPostsList);
