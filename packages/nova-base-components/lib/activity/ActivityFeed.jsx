import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Messages from 'meteor/nova:messages';
import {withRouter} from 'react-router'

class ActivityFeed extends Component {

    renderRowsExample() {
        return (
          <li className="itemIsSeen_8VH7C item_3BpQy">
              <a >
                  <span className="icon_2KQXZ"/>🎯
                  <div className="body_3ykHj">
                      <span>
                          <span>
                              <em>Ben Tossell</em>
                          </span>
                          posted
                          <em>Events, from Facebook</em>
                      </span>
                      <time className="time_1obuo">a day ago</time>
                  </div>
              </a>
              <span className="users_2UDuE">
                        <a className="link_j6xU_ user_18Xfo"
                           href="/@bentossell">
                            <span
                              className="user-image">
                            <div className="container_22rD3 user-image--image">
                                <div className="container__Ql6q lazyLoadContainer_3KgZD">
                                </div>
                            </div>
                            </span>
                        </a>
                  </span>
          </li>
        )
    }

    render() {

        const {currentUser} = this.context;
        if (!currentUser) {
            return (<Telescope.components.UserLoginPopup comp={{object: {showCloseIcon: false, title: '', subtitle: ''}}}/>);
        }

        const terms = {
            listId: "messages.list.popover",
            userId: currentUser._id,
            limit: 10
        };
        const {selector, options} = Messages.parameters.get(terms);

        return (
        <Telescope.components.NewsListContainer
          collection={Messages}
          publication="messages.list"
          selector={selector}
          options={options}
          terms={terms}
          component={Telescope.components.UserActivityList }
          listId={terms.listId}
          joins={Messages.getJoins()}
          limit={terms.limit}
        />
        )
    }

}

ActivityFeed.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(ActivityFeed);
export default withRouter(ActivityFeed);
