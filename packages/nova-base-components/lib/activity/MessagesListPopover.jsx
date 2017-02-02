import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {LinkContainer} from 'react-router-bootstrap';
import Messages from 'meteor/nova:messages';
import {withRouter} from 'react-router'

class MessagesListPopover extends Component {

    render() {
        const {comp} = this.props;
        const top = comp.top + comp.height + 14;
        const left = (comp.left + comp.width / 2) - 286 - 2;

        const {currentUser} = this.context;
        const terms = {
            view: 'popover',
            userId: currentUser._id,
            listId: "messages.list.popover",
            limit: 10
        };
        const {selector, options} = Messages.parameters.get(terms);

        return (
          <div className="popover v-bottom-center" style={{top: top, left: left}}>
              <Telescope.components.NewsListContainer
                collection={Messages}
                publication="messages.list"
                selector={selector}
                options={options}
                terms={terms}
                joins={Messages.getJoins()}
                component={Telescope.components.MessagesCompactList }
                cacheSubscription={false}
                listId={terms.listId}
                limit={terms.limit}
              />
          </div>
        )
    }

}

MessagesListPopover.propTypes = {
    user: React.PropTypes.object
};

MessagesListPopover.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object
};

module.exports = withRouter(MessagesListPopover);
export default withRouter(MessagesListPopover);
