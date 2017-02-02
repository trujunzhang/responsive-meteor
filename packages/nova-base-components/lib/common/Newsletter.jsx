import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import Formsy from 'formsy-react';
import {Input} from 'formsy-react-components';
import {Button} from 'react-bootstrap';
import Cookie from 'react-cookie';
import Users from 'meteor/nova:users';

class Newsletter extends Component {

    constructor(props, context) {
        super(props);
        this.subscribeEmail = this.subscribeEmail.bind(this);
        this.successCallbackSubscription = this.successCallbackSubscription.bind(this);
        this.dismissBanner = this.dismissBanner.bind(this);

        this.state = {
            showBanner: showBanner(context.currentUser)
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.currentUser) {
            this.setState({showBanner: showBanner(nextContext.currentUser)});
        }
    }

    subscribeEmail(data) {
        this.context.actions.call("newsletter.addEmail", data.email, (error, result) => {
            if (error) {
                console.log(error); // eslint-disable-line
                this.context.messages.flash(error.message, "error");
            } else {
                this.successCallbackSubscription(result);
            }
        });
    }

    successCallbackSubscription(result) {
        this.context.messages.flash(this.context.intl.formatMessage({id: "newsletter.success_message"}), "success");
        this.dismissBanner();
    }

    dismissBanner(e) {
        if (e && e.preventDefault) e.preventDefault();

        this.setState({showBanner: false});

        // set cookie
        Cookie.save('showBanner', "no");

        // set user setting too (if logged in)
        if (this.context.currentUser) {
            this.context.actions.call('users.setSetting', this.context.currentUser._id, 'newsletter.showBanner', false);
        }
    }

    renderButton() {
        return (
          <div className="news_letter_button_panel">
              <Telescope.components.NewsletterButton
                successCallback={() => this.successCallbackSubscription()}
                subscribeText={this.context.intl.formatMessage({id: "newsletter.subscribe"})}
                user={this.context.currentUser}
              />
          </div>
        )
    }

    renderForm() {
        return (
          <Formsy.Form className="form_1Nyhn" onSubmit={this.subscribeEmail}>
              <div className="fieldWrap_1C8su">
                  <Input
                    className="field_34Q-8 text_3Wjo0 subtle_1BWOT base_3CbW2"
                    name="email"
                    value=""
                    placeholder={this.context.intl.formatMessage({id: "newsletter.email"})}
                    type="email"
                    layout="elementOnly"
                  />
              </div>
              <Button
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
                type="submit" bsStyle="primary">
                  <FormattedMessage id="newsletter.subscribe" className="buttonContainer_wTYxi"/>
              </Button>
          </Formsy.Form>
        )
    }

    render() {
        const {showBanner} = this.state;
        if (!showBanner) {
            return null;
        }

        // 13/12/2016
        // When the user is already logged in, the message for newsletter subscription shoud be:
        // Get the best articles in your inbox every week. Subscribe to our newsletter. <subscribe button>

        const {currentUser} = this.context;
        const id = (!!currentUser ? "newsletter.subscribe_prompt_logged" : "newsletter.subscribe_prompt_no_logged");
        const title = this.context.intl.formatMessage({id: id});

        //let title = "Get the best articles in your inbox, weekly.";
        //if(!!currentUser){
        //title = "Get the best articles in your inbox every week. Subscribe to our newsletter.";
        //}

        return (
          <div className="constraintWidth_ZyYbM hide-via-blocking-js--subscribe-to-newsletter margin-top30">
              <div className="fullWidthBox_3Dggh box_c4OJj container_R3fsF">
                  <div className="content_DcBqe">
                      <div className="boxContent_2e30p">
                          <span className="close_1JGKW" onClick={this.dismissBanner.bind(this)}>
                            <svg width="12" height="12" viewBox="0 0 12 12">
                                <path d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                            </svg>
                          </span>
                          <span className="welcomeEmoji_3oUs1 welcome_emoji_icon"/>
                          <span
                            className="welcome_tPFOL boldText_3B8fa text_3Wjo0 default_tBeAo base_3CbW2">Welcome to Politicl.</span>
                          <span className="tagline_1UlAa text_3Wjo0 subtle_1BWOT base_3CbW2">{title}</span>
                          {currentUser ? this.renderButton() : this.renderForm()}
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

Newsletter.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    messages: React.PropTypes.object,
    intl: intlShape
};

function showBanner(user) {
    return (
      // showBanner cookie either doesn't exist or is not set to "no"
      Cookie.load('showBanner') !== "no"
      // and showBanner user setting either doesn't exist or is set to true
      && Users.getSetting(user, 'newsletter.showBanner', true)
      // and user is not subscribed to the newsletter already (setting either DNE or is not set to false)
      && !Users.getSetting(user, 'newsletter.subscribed', false)
    );
}

module.exports = Newsletter;
export default Newsletter;
