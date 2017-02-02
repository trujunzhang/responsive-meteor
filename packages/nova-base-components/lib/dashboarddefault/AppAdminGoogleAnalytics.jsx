import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';


class AppAdminGoogleAnalytics extends Component {

    render() {

        return (
          <div className="wrap">
              <h1>Google Analytics</h1>

              <div className="col-md-6">
                  <div className="box box-primary direct-chat direct-chat-primary">
                      <div id="google-analytics-panel">
                          <div id="embed-api-auth-container"></div>
                          <div id="chart-container"></div>
                          <div id="view-selector-container"></div>
                      </div>
                  </div>
              </div>
          </div>
        )

    }
}

AppAdminGoogleAnalytics.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminGoogleAnalytics.displayName = "AppAdminGoogleAnalytics";

module.exports = withRouter(AppAdminGoogleAnalytics);
export default withRouter(AppAdminGoogleAnalytics);
