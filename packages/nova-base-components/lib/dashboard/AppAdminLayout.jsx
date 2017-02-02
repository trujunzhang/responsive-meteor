import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {FlashContainer} from "meteor/nova:core";
import {withRouter} from 'react-router'

class AppAdminLayout extends Component {

    renderChildren() {
        const {type} = this.props.router.location.query;

        switch (type) {
            case "posts":
                return <Telescope.components.AppAdminPosts />;
            case "categories":
                return <Telescope.components.AppAdminCategories/>;
            case "topics":
                return <Telescope.components.AppAdminTopics/>;
            case "flags":
                return <Telescope.components.AppAdminFlags/>;
            case "users":
                return <Telescope.components.AppAdminUsers/>;
            case "comments":
                return <Telescope.components.AppAdminComments/>;
            case "caches":
                return <Telescope.components.AppAdminCaches/>;
            case "history":
                return <Telescope.components.AppAdminHistory/>;
            case "scrapyd":
                return <Telescope.components.AppAdminScrapyd/>;
            default:
                return (
                  <Telescope.components.SatisticContainer
                    publication="admin.app.statistic"
                    listId={"app.statistic"}
                    countKeys={[
                        "postsCount",
                        "usersCount",
                        "commentsCount"
                    ]}
                    component={Telescope.components.AppAdminDashboard}
                  />
                );
        }
    }

    render() {
        return (
          <div id="admin-dashboard" className="hold-transition skin-blue sidebar-mini">
              <Telescope.components.HeadTags googleAnalytics={true} showDrift={false}/>

              <FlashContainer component={Telescope.components.FlashMessages}/>
              <div className="wrapper">
                  <Telescope.components.AppAdminHeader />

                  <Telescope.components.AppAdminSidebar />

                  <div className="content-wrapper admin-content">

                      <div id="wpcontent">
                          <div id="wpbody" role="main">

                              <div id="wpbody-content">
                                  {this.renderChildren()}
                              </div>
                          </div>

                      </div>
                  </div>

                  <Telescope.components.AppAdminFooter />
              </div>
          </div>
        )

    }
}

AppAdminLayout.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminLayout.displayName = "AppAdminLayout";

module.exports = withRouter(AppAdminLayout);
export default withRouter(AppAdminLayout);
