import React, {PropTypes, Component} from 'react';
import {Accounts} from 'meteor/std:accounts-ui';
import {ContextPasser} from "meteor/nova:core";
import {withRouter} from 'react-router';

class PopoverPostsLayout extends Component {

    dismissCurrentPostPanel() {
        this.props.router.goBack();
    }

    render() {

        return (
          <div className="overlay_1AkSl modal-spotlight" id="popover-detailed-post">
              <a className="closeDesktop_XydFN" title="Close"
                 onClick={this.dismissCurrentPostPanel.bind(this)}>
                        <span>
                            <svg width="12" height="12" viewBox="0 0 12 12">
                                <path
                                  d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                            </svg>
                        </span>
              </a>
              <a className="closeMobile_15z3i" title="Close"
                 onClick={this.dismissCurrentPostPanel.bind(this)}>
                        <span>
                            <svg width="12" height="12" viewBox="0 0 12 12">
                                <path
                                  d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                            </svg>
                        </span>
              </a>
              {this.props.children}
          </div>

        )
    }

}

PopoverPostsLayout.propTypes = {
    user: React.PropTypes.object
};

PopoverPostsLayout.contextTypes = {
    messages: React.PropTypes.object
};

module.exports = withRouter(PopoverPostsLayout);
export default withRouter(PopoverPostsLayout);
