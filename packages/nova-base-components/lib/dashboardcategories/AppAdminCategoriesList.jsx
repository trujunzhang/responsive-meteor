import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ModalTrigger} from "meteor/nova:core";
import {withRouter} from 'react-router';


let numeral = require('numeral');

class AppAdminCategoriesList extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            // pagination
            postsPerPage: 10,
            // Edit
            editAll: false,
            editAllCallBack: null,
            editSingle: false,
            editSingleId: '',
        };

        this.onRowItemActionEventClick = this.onRowItemActionEventClick.bind(this);
    }

    onSingleEditCancelClick(error, result) {
        this.setState({editSingle: false, editSingleId: ''});
    }

    onSingleEditHook() {
        this.setState({editSingle: false, editSingleId: ''});
    }

    onUpdateClick() {
        const newObj = {name: this.state.nameValue, slug: this.state.slugValue};
        this.context.actions.call('categories.admin.edit', this.state.quickEditId, {$set: newObj}, (error, result) => {
            this.updateQuickEditId({_id: -1, name: '', slug: ''});
        });
    }

    onRowItemActionEventClick(type, category) {
        let self = this;
        this.actionEvent(type, [category._id], category, function (error, result) {
            self.onToggleEvent();
        });
    }

    onToggleEvent() {
        this.setState({editAll: false, editSingle: false, editSingleId: ''});
    }

    actionEvent(type, categoryIds, category, cb) {
        switch (type) {
            case "quick_edit":
                this.setState({editSingle: true, editSingleId: category._id});
                break;
        }
    }

    renderTableHeader() {
        return (
          <thead>
          <tr>
              {/*<td id="cb" className="manage-column column-cb check-column">*/}
              {/*<label className="screen-reader-text">Select All</label>*/}
              {/*<input id="cb-select-all-1" type="checkbox"/>*/}
              {/*</td>*/}
              <th scope="col" id="title" className="manage-column column-title column-primary sortable desc">
                  <a href="http://www.politicl.com/wp-admin/edit.php?mode=list&amp;orderby=title&amp;order=asc">
                      <span>Name</span>
                  </a>
              </th>
              <th scope="col" id="description" className="manage-column column-description">Description</th>
              <th scope="col" id="slug" className="manage-column column-slug">Slug</th>
              <th scope="col" id="posts" className="manage-column column-posts num">Count</th>
          </tr>
          </thead>
        )
    }

    renderTableFooter() {
        return (
          <tfoot>
          <tr>
              {/*<td className="manage-column column-cb check-column">*/}
              {/*<label className="screen-reader-text">Select All</label>*/}
              {/*<input id="cb-select-all-2" type="checkbox"/>*/}
              {/*</td>*/}
              <th scope="col" className="manage-column column-title column-primary sortable desc">
                  <a >
                      <span>Name</span>
                  </a>
              </th>
              <th scope="col" id="author" className="manage-column column-author">Description</th>
              <th scope="col" id="author" className="manage-column column-curator">Slug</th>
              <th scope="col" id="categories" className="manage-column column-categories">Count</th>
          </tr>
          </tfoot>
        )
    }

    renderTopbar() {
        const categories = this.props.results ? this.props.results : [];
        const tableCount = categories.length;

        return (
          <div className="tablenav top">

              <h2 className="screen-reader-text">Categories list navigation</h2>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderButtonbar() {
        const categories = this.props.results ? this.props.results : [];
        const tableCount = categories.length;

        return (
          <div className="tablenav bottom">

              <h2 className="screen-reader-text">Categories list navigation</h2>
              <Telescope.components.PaginationContainer
                tableCount={tableCount}
                countPerPage={this.state.postsPerPage}
              />

              <br className="clear"/>
          </div>
        )
    }

    renderTableRow(category, index) {

        return (
          <Telescope.components.AppAdminCategoryItem
            key={index}
            index={index}
            category={category}
            actionEvent={this.onRowItemActionEventClick}
          />
        )
    }

    renderCategoriesEditSingle(rows, category) {
        if (this.state.editSingle && this.state.editSingleId == category._id) {
            rows.push(
              <Telescope.components.AppAdminCategoriesEditSingle
                onEditSingleCancelClick={this.onSingleEditCancelClick.bind(this)}
                editSingleHook={this.onSingleEditHook.bind(this)}
                category={category}/>
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
                          <div className="admin-table-loading">No Categories found.</div>
                      </div>
                  </td>
              </tr>
              </tbody>
            )
        }

        let rows = [];

        results.map((item, index) => {
            let haveEdit = this.renderCategoriesEditSingle(rows, item);
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
          <div id="posts-filter">

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

AppAdminCategoriesList.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCategoriesList.displayName = "AppAdminCategoriesList";

module.exports = withRouter(AppAdminCategoriesList);
export default withRouter(AppAdminCategoriesList);
