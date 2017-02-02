import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

class WidgetHeader extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {};
    }

    render() {
        return (
          <div className="header_3GFef">
              <span
                className="sidebarTitle_25eeI secondaryBoldText_1PBCf secondaryText_PM80d default_tBeAo base_3CbW2">{this.props.message}
              </span>
          </div>
        )
    }

}

WidgetHeader.displayName = "WidgetHeader";

module.exports = WidgetHeader;
