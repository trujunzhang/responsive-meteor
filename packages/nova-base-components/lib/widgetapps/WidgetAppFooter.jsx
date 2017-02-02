import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import {withRouter} from 'react-router';

class WidgetAppFooter extends Component {

    onLinkClick(path) {
        this.context.messages.pushRouter(this.props.router, {pathname: path, query: {}});
    }

    renderFooterMenus() {
        const politiclEmail = Telescope.settings.get('defaultEmail', 'contact@politicl.com');

        return (
          <ul className="u-cf">
              <li className="Footer-item">
                  <a className="Footer-link"
                     onClick={this.onLinkClick.bind(this, "/about")}
                     title="More about Politicl">
                      About
                  </a>
              </li>
              <li className="Footer-item">
                  <a className="Footer-link"
                     onClick={this.onLinkClick.bind(this, "/careers")}
                     title="Read Politicl’s terms of service">
                      Careers
                  </a>
              </li>
              <li className="Footer-item">
                  <Telescope.components.MailTo
                    className="Footer-link"
                    email={politiclEmail}
                    value="Contact us"
                    title="Contact to Politicl"/>
              </li>
              <li className="Footer-item">
                  <a className="Footer-link"
                     onClick={this.onLinkClick.bind(this, "/terms")}
                     title="Read Politicl’s policies's Terms of Use">
                      Terms of Use
                  </a>
              </li>
              <li className="Footer-item">
                  <a className="Footer-link"
                     onClick={this.onLinkClick.bind(this, "/privacy")}
                     title="Read Politicl’s policies">
                      Privacy Policy
                  </a>
              </li>
          </ul>
        )
    }

    render() {
        return (
          <div className="paddedBox_2UY-S box_c4OJj sidebarBox_1-7Yk sidebarBoxPadding_y0KxM"
               id="app-footer">
              <div className="Footer module roaming-module">
                  <div className="flex-module">
                      <div className="flex-module-inner js-items-container">
                          {this.renderFooterMenus()}
                          <div className="Footer-item Footer-copyright copyright">
                              {"© " + moment(new Date()).format("YYYY") + " Politicl"}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

WidgetAppFooter.contextTypes = {
    messages: React.PropTypes.object
};

WidgetAppFooter.displayName = "WidgetAppFooter";

module.exports = withRouter(WidgetAppFooter);
export default withRouter(WidgetAppFooter);
