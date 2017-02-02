import React, {PropTypes, Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {Button} from 'react-bootstrap';
import Users from 'meteor/nova:users';

class NewsletterButton extends Component {
    constructor(props) {
        super(props);
        this.subscriptionAction = this.subscriptionAction.bind(this);
    }

    subscriptionAction() {
        const action = Users.getSetting(this.props.user, 'newsletter.subscribed', false) ?
          'newsletter.removeUser' : 'newsletter.addUser';
        this.context.actions.call(action, this.props.user, (error, result) => {
            if (error) {
                console.log(error); // eslint-disable-line
                this.context.messages.flash(error.message, "error");
            } else {
                this.props.successCallback(result);
            }
        });
    }

    render() {
        const isSubscribed = Users.getSetting(this.props.user, 'newsletter.subscribed', false);

        return (
          <Button
            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
            onClick={this.subscriptionAction}
          >
              {isSubscribed ? <FormattedMessage id="newsletter.unsubscribe"/> : <FormattedMessage id="newsletter.subscribe"/>}
          </Button>
        )
    }
}

NewsletterButton.propTypes = {
    successCallback: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
};

NewsletterButton.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object,
    actions: React.PropTypes.object,
};

module.exports = NewsletterButton;
export default NewsletterButton;
