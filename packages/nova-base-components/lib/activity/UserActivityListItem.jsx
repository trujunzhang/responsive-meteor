import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import Users from 'meteor/nova:users';
import Messages from 'meteor/nova:messages';
import {withRouter} from 'react-router'

class UserActivityListItem extends Component {

    onMessageItemHover(message, haveView) {
        if (!haveView) {
            this.context.actions.call('messages.add.reader', message._id, this.context.currentUser._id, (error, result) => {

            });
        }
    }

    onItemClick(information) {
        if (!!information.link) {
            this.context.messages.pushRouter(this.props.router, information.link);
        }
    }

    render() {
        const {message, index} = this.props,
          {currentUser} = this.context;

        const information = Messages.generateMessage(message);

        if (!information) {
            return null;
        }

        let haveView = Messages.haveView(message, currentUser);

        return (
          <li key={message._id}
              id="message_item_link"
              disabled={(!information.link)}
              className={haveView ? "itemIsSeen_8VH7C item_3BpQy" : "item_3BpQy"}
              onMouseOver={this.onMessageItemHover.bind(this, message, haveView)}>
              <a onClick={this.onItemClick.bind(this, information)} disabled={(!information.link)}>
                  <div className="body_3ykHj activity_list_render">
                      {information.render}
                      <time className="time_1obuo"><FormattedRelative value={message.postedAt}/></time>
                  </div>
              </a>
              <span className="users_2UDuE">
                  <a className="link_j6xU_ user_18Xfo" href="/@bentossell">
                      <span className="user-image">
                          <Telescope.components.UsersBlurryImageAvatar
                            avatarObj={information.avatarObj}
                            size={32}/>
                      </span>
                  </a>
               </span>
          </li>
        )
    }
}

UserActivityListItem.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(UserActivityListItem);
export default withRouter(UserActivityListItem);
