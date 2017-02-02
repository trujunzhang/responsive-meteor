import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router'
import moment from 'moment';

class AppAdminFooter extends Component {

    render() {
        const year = moment(new Date()).format("YYYY");
        return (
          <footer className="main-footer">
              <div className="pull-right hidden-xs">
                  <b>Version</b> 2.4.7
              </div>
              <strong>{"Copyright © " + year + " "}</strong> All rights reserved.
          </footer>
        )
    }
}

AppAdminFooter.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminFooter.displayName = "AppAdminFooter";

module.exports = withRouter(AppAdminFooter);
export default withRouter(AppAdminFooter);
