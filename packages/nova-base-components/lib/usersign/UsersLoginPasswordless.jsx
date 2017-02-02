import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UsersLoginPasswordless extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            email: "",
            // Message
            message: null,
        };
    }

    showMessage(message, type, clearTimeout) {
        message = message.trim();

        if (message) {
            this.setState({
                message: {
                    message: message,
                    type: type
                }
            });
            if (clearTimeout) {
                Meteor.setTimeout(() => {
                    this.setState({message: null});
                }, clearTimeout);
            }
        }
    }

    senderEmailToSign(e) {
        if (this.state.email == "" || this.state.email.indexOf('@') === -1) {
            this.showMessage("invalid email", 'error');
            return;
        }

        this.context.actions.call('signin.passwordless.with.email', this.state.email, (error, result) => {
            if (!!error) {
                this.showMessage(error.error, 'error');
            } else {
                this.props.switchFormState(e, "SEND_EMAIL_RESULT");
            }
        });

    }

    renderSignInForm() {
        return (
          <div id="user-signin-panel" className="overlay--dark">
              <div className="overlay-dialog--email">
                  <div className="overlay-content">
                      <div className="u-paddingTop10">Email address</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="email" name="email" className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email" placeholder="yourname@example.com" value={this.state.email} onChange={(e) => this.setState({"email": e.target.value})}/>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    renderButtonSet() {
        return (
          <div className="overlay-actions buttonSet" id="button-set-panel">

              <div className="buttonSet buttonSet--vertical">
                  <button
                    onClick={this.senderEmailToSign.bind(this)}
                    className="button button--withChrome u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--withIconAndLabel button button--signin button--email button--overlayConfirm"
                    title="Email me a link to sign in">
                      <div>
                          <span className="svgIcon svgIcon--email svgIcon--25px">
                          <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">
                                <path d="M5.61 5A2.498 2.498 0 0 0 3.1 7.49v.323l9 5.065c.253.142.747.142 1 0l8.897-5.065V7.49A2.501 2.501 0 0 0 19.487 5H5.61zm5.876 9.215L3.1 9.495v8.002A2.503 2.503 0 0 0 5.59 20h13.922a2.499 2.499 0 0 0 2.49-2.503v-8l-8.288 4.718c-.318.18-.716.268-1.114.268-.398 0-.796-.09-1.114-.268z"/>
                            </svg>
                          </span>
                          <span className="button-label js-buttonLabel">Email me a link to sign in</span>
                      </div>
                  </button>
              </div>

              <div className="row login-via-email" onClick={(e)=>this.props.switchFormState(e, "MAIN")}>
                  < button id="login-via-main" className="button button--chromeless button--link u-baseColor--buttonNormal button--large js-cancel" title="Enter your email address to sign in or create an account on Politicl" aria-label="Enter your email address to sign in or create an account on Politicl" type="email">Or sign in with Facebook, Twitter</button>
              </div>

          </div>
        )
    }

    render() {
        return (
          <div className="overlay-dialog overlay-dialog--update overlay-dialog--alert overlay-dialog--animate js-overlayDialog" id="passwordless-form">
              <h3 className="overlay-title">Enter your email address to sign in or create an account on Politicl</h3>
              <span>
                {!!this.state.message
                  ? <div className="errorMessage_2lxEG">{this.state.message.message}</div>
                  : null}
                  {this.renderSignInForm()}
                  {this.renderButtonSet()}
              </span>


              <div className="overlay-footer">
                  <a className="link u-baseColor--link" href="/login-faq" target="_blank">Having trouble signing in?</a>
              </div>
          </div>
        )
    }
}

UsersLoginPasswordless.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersLoginPasswordless.displayName = "UserEmailResetPassword";

module.exports = UsersLoginPasswordless;
