import React, {PropTypes, Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/std:accounts-ui';
import {Modal, Dropdown, MenuItem} from 'react-bootstrap';
import {ContextPasser} from "meteor/nova:core";
import {LinkContainer} from 'react-router-bootstrap';
import Users from 'meteor/nova:users';

class HeaderPopoverMenu extends Component {

    constructor(props) {
        super(props);

        this.links = [
            {"href": "/tech", "title": "ABOUT"},
            {"href": "/games", "title": "TEAM"},
            {"href": "/podcasts", "title": "CONTACT"},
            {"href": "/books", "title": "PRIVACY POLICY"},
            {"href": "/topics/developer-tools", "title": "TERMS OF USE"},
            {"href": "/topics/photography-tools", "title": "Cookie Policy"}
        ];
    }

    onMenuItemClick(menu) {

    }

    render() {

        const {comp} = this.props;
        const top = comp.top + comp.height + 14;
        const left = (comp.left + comp.width / 2) - 75;

        return (
          <div className="popover v-bottom-center" style={{top: top, left: left}}>
              <ul className="content_2mq4P">
                  {this.links.map((menu, index) => {
                      return (
                        <li key={index}
                            className="option_2XMGo secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                            <a onClick={this.onMenuItemClick.bind(this, menu)}>{menu.title}</a>
                        </li>
                      )
                  })}
              </ul>
          </div>
        )
    }
}

HeaderPopoverMenu.contextTypes = {
    messages: React.PropTypes.object
};

module.exports = HeaderPopoverMenu;
export default HeaderPopoverMenu;