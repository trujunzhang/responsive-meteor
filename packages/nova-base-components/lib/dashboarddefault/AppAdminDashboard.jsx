import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';

let numeral = require('numeral');

class AppAdminDashboard extends Component {

    onSidebarMenuClick(type) {
        this.context.messages.appManagement.pushAdminSidebar(this.props.router, type);
    }

    renderDashboard() {
        const postsCount = this.props.postsCount ? this.props.postsCount : 0;
        const usersCount = this.props.usersCount ? this.props.usersCount : 0;
        const commentsCount = this.props.commentsCount ? this.props.commentsCount : 0;

        return (
          <div className="wrap">
              <h1>Dashboard</h1>

              <div className="col-md-6">
                  <div className="box box-primary direct-chat direct-chat-primary">
                      <div className="box-header with-border">
                          <h3 className="box-title">At a Glance</h3>

                          <div className="box-tools pull-right">
                              <a type="button" className="btn btn-box-tool">
                                  <i className="fa fa-minus"/>
                              </a>
                          </div>
                      </div>
                      <div className="box-body">
                      </div>
                      <div className="box-footer">
                          <div className="row">
                              <div className="col-sm-4 border-right">
                                  <div className="description-block">
                                      <h5 className="description-header">{numeral(postsCount).format('0,0')}</h5>
                                      <span className="description-text fa fa-edit ">
                                          <a onClick={this.onSidebarMenuClick.bind(this, "posts")} className="left-icon">Posts</a>
                                      </span>
                                  </div>
                              </div>
                              <div className="col-sm-4 border-right">
                                  <div className="description-block">
                                      <h5 className="description-header">{numeral(commentsCount).format('0,0')}</h5>
                                      <span className="description-text fa fa-comments">
                                          <a onClick={this.onSidebarMenuClick.bind(this, "comments")} className="left-icon">Comments</a>
                                      </span>
                                  </div>
                              </div>
                              <div className="col-sm-4">
                                  <div className="description-block">
                                      <h5 className="description-header">{numeral(usersCount).format('0,0')}</h5>
                                      <span className="description-text fa fa-users">
                                          <a onClick={this.onSidebarMenuClick.bind(this, "users")} className="left-icon">Users</a>
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    render() {
        const props = this.props;
        return (
          <div>
              <div className="row">
                  <div id="wpcontent">
                      {this.renderDashboard()}
                  </div>
              </div>
              <div className="row">
                  {/*<Telescope.components.AppAdminGoogleAnalytics/>*/}
              </div>
          </div>
        )

    }
}

AppAdminDashboard.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminDashboard.displayName = "AppAdminDashboard";

module.exports = withRouter(AppAdminDashboard);
export default withRouter(AppAdminDashboard);
