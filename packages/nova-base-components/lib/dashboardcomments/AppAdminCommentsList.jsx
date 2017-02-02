import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class AppAdminCommentsList extends Component {

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
        this.onCommentsActionEventClick = this.onCommentsActionEventClick.bind(this);
        this.onRowItemActionEventClick = this.onRowItemActionEventClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const _rowState = this.resetSelectRowState(nextProps.results);

        this.setState({checkAll: false, rowState: _rowState});
    }

    resetSelectRowState(results) {
        let _rowState = [];
        if (!!results) {
            results.forEach(function (comment) {
                _rowState.push({id: comment._id, checked: false});
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
              <th scope="col" id="title" className="manage-column column-author sortable desc"><a><span>Author</span></a></th>
              <th scope="col" id="comment" className="manage-column column-comment">Comment</th>
              <th scope="col" id="Response" className="manage-column column-response sortable desc">In Response To</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc"><a><span>Submitted On</span></a></th>
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
              <th scope="col" className="manage-column column-author sortable desc"><a><span>Author</span></a></th>
              <th scope="col" className="manage-column column-comment">Comment</th>
              <th scope="col" className="manage-column column-response sortable desc">In Response To</th>
              <th scope="col" className="manage-column column-date sorted desc"><a><span>Submitted On</span></a></th>
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
        return (
          <div className="alignleft actions">
              <input type="submit"
                     name="filter_action"
                     id="comment-query-submit"
                     onClick={this.onApproveListClick.bind(this)}
                     className="button"
                     value="Approving"/>
          </div>
        )
    }

    onCommentsActionEventClick(type, cb) {
        this.actionEvent(type, this.getCheckedIds(), null, cb);
    }

    onRowItemActionEventClick(type, comment) {
        let self = this;
        this.actionEvent(type, [comment._id], comment, function (error, result) {
            self.onToggleEvent();
        });
    }

    actionEvent(type, itemIds, comment, cb) {
        let self = this;
        switch (type) {
            case "approve":
                this.context.actions.call('comments.approving.status', comment._id, Comments.config.STATUS_APPROVED,
                  (error, result) => {
                      self.setState({isSubmitting: false});
                      if (!!error) {
                          self.context.messages.flash("Approve the comment's status failure", "error")
                      }
                  });
                break;
            case "unapprove":
                this.context.actions.call('comments.approving.status', comment._id, Comments.config.STATUS_PENDING,
                  (error, result) => {
                      self.setState({isSubmitting: false});
                      if (!!error) {
                          self.context.messages.flash("Approve the comment's status failure", "error")
                      }
                  });
                break;
            case "spam":
                this.context.actions.call('comments.approving.status', comment._id, Comments.config.STATUS_SPAM,
                  (error, result) => {
                      self.setState({isSubmitting: false});
                      if (!!error) {
                          self.context.messages.flash("Approve the comment's status failure", "error")
                      }
                  });
                break;
            case "trash":
                this.context.actions.call('comments.move.to.trash', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "edit":

                break;
            case "quick_edit":
                this.setState({editAll: false, editAllCallBack: null, editSingle: true, editSingleId: comment._id});
                break;
            case "preview":

                break;
            case "restore":
                this.context.actions.call('comments.restore.to.last.status', itemIds, (error, result) => {
                    cb(error, result);
                });
                break;
            case "delete_permanently":
                const deleteFolderConfirm = "Are you sure you want to delete this comment? There is no way back. This is a path without return! Be brave?";
                if (window.confirm(deleteFolderConfirm)) {
                    this.context.actions.call('comments.delete.permanently', itemIds, (error, result) => {
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

              <Telescope.components.AppAdminCommentsAction actionEvent={this.onCommentsActionEventClick}/>
              {this.renderFilter()}

              <h2 className="screen-reader-text">Comments list navigation</h2>
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

              <Telescope.components.AppAdminCommentsAction actionEvent={this.onCommentsActionEventClick}/>

              <div className="alignleft actions"></div>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />
              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(comment, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminCommentItem
            key={index}
            index={index}
            comment={comment}
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

    renderCommentsEditSingle(rows, comment) {
        if (this.state.editSingle && this.state.editSingleId == comment._id) {
            rows.push(
                <Telescope.components.AppAdminCommentsEditSingle
                key="commentEditSingle"
                onEditSingleCancelClick={this.onSingleEditCancelClick.bind(this)}
                editSingleHook={this.onSingleEditHook.bind(this)}
                comment={comment}/>
            );
            return true;
        }
        return false;
    }

    renderTableRows() {
        const posts = (!!this.props.results && this.props.results.length > 0 ) ? this.props.results : [];
        if (posts.length == 0) {
            return (
              <tbody id="the-comment-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No comments found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        posts.map((item, index) => {
            let haveEdit = this.renderCommentsEditSingle(rows, item);
            if (!haveEdit) {
                rows.push(this.renderTableRow(item, index));
            }
        });

        return (
          <tbody id="the-comment-list">
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
                          <div className={"comment-loadmore-spinner"}>
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

    renderTableTitle() {
        const {router} = this.props,
          {location} = router,
          {query}= location,
          {postId} = query;

        return (
          <h1 className="admin-posts-title">{"Comments" + (!!postId ? ' on “' : '')}
              {!!postId ? (
                  <Telescope.components.PostDocumentContainer
                    key={postId}
                    collection={Posts}
                    publication="posts.single.comment"
                    selector={{_id: postId}}
                    terms={{_id: postId}}
                    documentPropName="post"
                    component={Telescope.components.AppAdminCommentsListTitle}
                  />
                ) : null}
              {(!!postId ? '“' : '')}
              <Telescope.components.AppSearchTitle/>
          </h1>
        )
    }

    render() {

        return (
          <div className="wrap" id="admin-posts-ui">
              {this.renderTableTitle()}

              <Telescope.components.AppAdminCommentsTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

              {this.renderTopbar()}
              <table className="wp-list-table widefat fixed striped comments">

                  {this.renderTableHeader()}

                  {!this.props.ready ? this.renderLoading() : this.renderTableRows()}

                  {this.renderTableFooter()}
              </table>

              {this.renderButtonbar()}
          </div>
        )

    }
}

AppAdminCommentsList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCommentsList.displayName = "AppAdminCommentsList";

module.exports = withRouter(AppAdminCommentsList);
export default withRouter(AppAdminCommentsList);
