import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import {withRouter} from 'react-router';

class AppFooter extends Component {

    // 31/01/2017
    // Copyright © 2017 - Inkreason Enterprises Terms of Service & Privacy Policy
    render() {
        return (
          <footer className="footer_ZFfDU text_3Wjo0 subtle_1BWOT base_3CbW2">
              <p role="contentinfo">
                  {"Copyright © " + moment(new Date()).format("YYYY") + " - Inkreason Enterprises "}
                  <a onClick={(e) => {
                      this.context.messages.pushRouter(this.props.router, {pathname: "/terms"});
                  }}
                     className="footer_terms_of_service">
                      Terms of Service
                  </a>
                  {" & "}
                  <a onClick={(e) => {
                      this.context.messages.pushRouter(this.props.router, {pathname: "/privacy"});
                  }}
                     className="footer_terms_of_service">
                      Privacy Policy
                  </a>
              </p>
          </footer>
        )
    }
}

AppFooter.contextTypes = {
    messages: React.PropTypes.object
};

AppFooter.displayName = "AppFooter";

module.exports = withRouter(AppFooter);
export default withRouter(AppFooter);
