import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {withRouter} from 'react-router'

let numeral = require('numeral');

class AppAdminSidebar extends Component {

    constructor(props) {
        super(props);

        const type = props.router.location.query.type;
        let openType = '';
        if ((type == "posts") || (type == "categories") || (type == "topics")) {
            openType = "posts";
        }

        this.state = {
            openType: openType,
        };
    }

    onPostMenuClick() {
        const {type} = this.props.router.location.query;
        if (this.state.openType == "posts") {
            this.setState({openType: ""});
        } else {
            this.setState({openType: "posts"});
        }
    }

    onSidebarMenuClick(type, openType = "") {
        this.setState({openType: openType});
        this.context.messages.appManagement.pushAdminSidebar(this.props.router, type);
    }

    renderPostSubmenu() {
        const {type} = this.props.router.location.query;
        return (
          <li className={"treeview " + (( this.state.openType == "posts") ? "active" : "")}>
              <a onClick={this.onPostMenuClick.bind(this)}>
                  <i className="fa fa-edit"/>
                  <span>Posts</span>
                  <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right"/>
                  </span>
              </a>
              <ul className={"treeview-menu " + (this.state.openType == "posts" ? "menu-open" : "")}>
                  <li className={type == "posts" ? "active" : ""}>
                      <a onClick={this.onSidebarMenuClick.bind(this, "posts", "posts")}>
                          All Posts
                      </a>
                  </li>
                  <li className={type == "categories" ? "active" : ""}>
                      <a onClick={this.onSidebarMenuClick.bind(this, "categories", "posts")}>
                          Categories
                      </a>
                  </li>
                  <li className={type == "topics" ? "active" : ""}>
                      <a onClick={this.onSidebarMenuClick.bind(this, "topics", "posts")}>
                          Topics
                      </a>
                  </li>
              </ul>
          </li>
        )
    }

    renderAppItemsMenu() {
        const {type} = this.props.router.location.query;
        return (
          <ul className="sidebar-menu" id="adminmenu">
              {/*<li className="header">MAIN NAVIGATION</li>*/}
              <li className={"treeview " + (!type ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "")}>
                      <i className="fa fa-dashboard"/>
                      <span>Dashboard</span>
                  </a>
              </li>
              {/*post sub menu*/}
              {this.renderPostSubmenu()}
              <li className={"treeview " + (type == "flags" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "flags")}>
                      <i className="fa fa-th"/>
                      <span>Reported Posts</span>
                  </a>
              </li>
              <li className={"treeview " + (type == "widgets" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "widgets")}>
                      <i className="fa fa-th"/>
                      <span>Widgets</span>
                  </a>
              </li>
              <li className={"treeview " + (type == "comments" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "comments")}>
                      <i className="fa fa-comments"/>
                      <span>Comments</span>
                  </a>
              </li>
              <li className={"treeview " + (type == "users" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "users")}>
                      <i className="fa fa-users"/>
                      <span>Users</span>
                  </a>
              </li>
          </ul>
        )
    }

    renderCrawlerItemsMenu() {
        const {type} = this.props.router.location.query;
        return (
          <ul className="sidebar-menu" id="adminmenu">
              {/*<li className="header">Scraper Items</li>*/}
              <li className={"treeview " + (type == "caches" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "caches")}>
                      <i className="fa fa-th"/>
                      <span>Caches</span>
                  </a>
              </li>
              <li className={"treeview " + (type == "history" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "history")}>
                      <i className="fa fa-history"/>
                      <span>History</span>
                  </a>
              </li>
              <li className={"treeview " + (type == "scrapyd" ? "active" : "")}>
                  <a onClick={this.onSidebarMenuClick.bind(this, "scrapyd")}>
                      <i className="fa fa-tasks"/>
                      <span>Scrapyd</span>
                  </a>
              </li>
          </ul>
        )
    }

    render() {

        return (
          <aside className="main-sidebar">
              <section className="sidebar admin-sidebar">
                  {this.renderAppItemsMenu()}
                  {this.renderCrawlerItemsMenu()}
              </section>
          </aside>
        )

    }
}

AppAdminSidebar.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminSidebar.displayName = "AppAdminSidebar";

module.exports = withRouter(AppAdminSidebar);
export default withRouter(AppAdminSidebar);
