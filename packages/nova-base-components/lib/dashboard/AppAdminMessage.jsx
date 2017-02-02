import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {IntlProvider, intlShape} from 'react-intl';
import {AppComposer} from "meteor/nova:core";

class AppAdminMessage extends Component {

    render() {
        return (
          <div id="message" className="updated notice is-dismissible"><p>Categories deleted.</p>
              <button type="button" className="notice-dismiss">
                  <span className="screen-reader-text">Dismiss this notice.</span>
              </button>
          </div>
        )
    }

}

AppAdminMessage.propTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object,
};

module.exports = AppComposer(AppAdminMessage);
export default AppComposer(AppAdminMessage);