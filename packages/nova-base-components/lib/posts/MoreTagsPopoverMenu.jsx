import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {withRouter} from 'react-router';

class MoreTagsPopoverMenu extends Component {

    onTagClick(topic) {
        this.context.messages.dismissPopoverMenu();
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {topicId: topic._id}}, topic.name);
    }

    render() {
        const {comp} = this.props;
        const top = comp.top + comp.height + 14;
        const left = comp.left + comp.width -22;
        const object = comp.object;

        return (
          <div className="popover v-bottom-right" style={{top: top, left: left}}>
              <ul className="content_2mq4P">

                  {object.map((menu, key) => {
                      return (
                        <li
                          key={key}
                          className="option_2XMGo secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                            <a
                              onClick={this.onTagClick.bind(this, menu)}
                              className="button_2I1re smallSize_1da-r secondaryText_PM80d greySolidColor_270pZ solidVariant_2wWrf"
                              title={menu.name}>
                                <div className="buttonContainer_wTYxi">{menu.name}</div>
                            </a>
                        </li>
                      )
                  })}

              </ul>
          </div>
        )
    }

}

MoreTagsPopoverMenu.propTypes = {
    user: React.PropTypes.object
};

MoreTagsPopoverMenu.contextTypes = {
    messages: React.PropTypes.object
};

module.exports = withRouter(MoreTagsPopoverMenu);
export default withRouter(MoreTagsPopoverMenu);
