import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Alert} from 'react-bootstrap';
import {Messages} from "meteor/nova:core";

class NoPermissionPanel extends Component {

    constructor() {
        super();
    }

    render() {
        return (
          <div id="web-app-panel">
              <div>
                  <Telescope.components.Header {...this.props} />
              </div>

              <div className={ 'overlayInactive_1UI7W'}></div>

              <div id="container">

                  <div className="analyze-error box box-error margin_top40">
                      <h3>Permission Error</h3>
                      <p className="analyze-error-detail">
                          <strong>The page have no permission to load</strong>
                      </p>
                      <p className="analyze-error-help">
                          Sorry, you do not have the permission to do this at this time.
                      </p>
                  </div>

              </div>

          </div>
        )

    }
}

NoPermissionPanel.propTypes = {};

NoPermissionPanel.contextTypes = {};

module.exports = NoPermissionPanel;