import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';


class AppAdminUsersList extends Component {

    constructor(props) {
        super(props);

        const _rowState = this.resetSelectRowState(props.results);
        this.state = this.initialState = {
            // select all
            checkAll: false,
            rowState: _rowState,
            // pagination
            postsPerPage: 10,
            // Edit
            editAll: false,
            editAllCallBack: null,
            editSingle: false,
            editSingleId: '',
        };

        this.checkAll = this.checkAll.bind(this);
        this.checkRow = this.checkRow.bind(this);
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

    onToggleEvent() {
        this.setState({editAll: false, editSingle: false, editSingleId: ''});
    }

    onRowItemActionEventClick(type, user) {
        let self = this;
        this.actionEvent(type, [user._id], user, function (error, result) {
            self.onToggleEvent();
        });
    }

    actionEvent(type, userIds, user, cb) {
        switch (type) {
            case "bulk-edit":
                if (userIds.length > 0) {
                    this.setState({editAll: true, editAllCallBack: cb});
                }
                break;
            case "edit":
                break;
            case "review":
                Users.openNewWindow("/users/" + user.telescope.slug, {});
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
              <th scope="col" id="title" className="manage-column column-title column-primary sortable desc"><a><span>Username</span></a>
              </th>
              <th scope="col" id="name" className="manage-column column-author">Name</th>
              <th scope="col" id="email" className="manage-column column-curator">Email</th>
              <th scope="col" id="role" className="manage-column column-categories">Role</th>
              <th scope="col" id="loginType" className="manage-column column-loginType">Login Type</th>
              <th scope="col" id="posts" className="manage-column column-posts num">Posts</th>
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
                  <input id="cb-select-all-1" type="checkbox" onChange={this.checkAll} checked={this.state.checkAll}/>
              </td>
              <th scope="col" className="manage-column column-title column-primary sortable desc"><a><span>Username</span></a></th>
              <th scope="col" id="name" className="manage-column column-author">Name</th>
              <th scope="col" id="email" className="manage-column column-curator">Email</th>
              <th scope="col" id="role" className="manage-column column-categories">Role</th>
              <th scope="col" id="loginType" className="manage-column column-categories">Login Type</th>
              <th scope="col" id="posts" className="manage-column column-posts num">Posts</th>
              <th scope="col" id="date" className="manage-column column-date sorted desc"><a><span>Date</span></a></th>
          </tr>
          </tfoot>

        )
    }

    renderTopbar() {
        const tableCount = this.props.tablePostCount ? this.props.tablePostCount : 0;

        return (
          <div className="tablenav top">

              <Telescope.components.AppAdminUsersAction getCheckedTopicIds={this.getCheckedTopicIds.bind(this)}/>

              <h2 className="screen-reader-text">Users list navigation</h2>

              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderButtonbar() {
        const tableCount = this.props.tablePostCount ? this.props.tablePostCount : 0;

        return (
          <div className="tablenav bottom">

              <Telescope.components.AppAdminUsersAction getCheckedTopicIds={this.getCheckedTopicIds.bind(this)}/>

              <h2 className="screen-reader-text">Users list navigation</h2>

              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(user, index) {
        let checked = false;
        if (!!this.state.rowState) {
            checked = this.state.rowState[index].checked;
        }

        return (
          <Telescope.components.AppAdminUserItem
            key={index}
            index={index}
            user={user}
            actionEvent={this.onRowItemActionEventClick}
            checked={checked}
            callback={this.checkRow}/>
        )
    }

    renderTableRows() {
        const {results} = this.props;
        if (results.length === 0) {
            return (
              <tbody id="the-list">
              <tr>
                  <td>
                      <div className="row" id="table_no_items">
                          <div className="admin-table-loading">No users found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        return (
          <tbody id="the-list">
          {(!!results && results.length > 0 ) ? results.map((user, index) => this.renderTableRow(user, index)) : null}
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
                  Users
                  <Telescope.components.AppSearchTitle/>
              </h1>

              <Telescope.components.AppAdminUsersTopAction {...this.props} toggleEvent={this.onToggleEvent.bind(this)}/>

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

AppAdminUsersList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminUsersList.displayName = "AppAdminUsersList";

module.exports = withRouter(AppAdminUsersList);
export default withRouter(AppAdminUsersList);
