import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserForgetPassword extends Component {

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
            this.setState({message: {message: message, type: type}});
            if (clearTimeout) {
                Meteor.setTimeout(() => {
                    this.setState({message: null});
                }, clearTimeout);
            }
        }
    }

    passwordReset() {
        const {
          email = '',
          waiting
        } = this.state;

        if (waiting) {
            return;
        }

        if (email.indexOf('@') !== -1) {
            this.setState({waiting: true});

            Accounts.forgotPassword({email: email}, (error) => {
                if (error) {
                    this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
                }
                else {
                    this.showMessage(T9n.get("info.emailSent"), 'success', 5000);
                }

                this.setState({waiting: false});
            });
        }
        else {
            this.showMessage(T9n.get("error.accounts.Invalid email"), 'warning');
        }
    }

    onSignedInHook() {
        this.context.messages.dismissPopoverMenu();
    }

    renderForgetPasswordForm() {
        return (
          <div id="user-signin-panel" className="overlay--dark">
              <div className="overlay-dialog--email">
                  <div className="overlay-content">
                      <div className="u-paddingTop10">Email address</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="email" name="email"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                                 placeholder="yourname@example.com"
                                 value={this.state.email}
                                 onChange={(e)=>this.setState({"email": e.target.value})}
                          />
                      </div>
                  </div>

                  <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
                      <div className="buttonWithNotice_3bRZb">
                          <button
                            onClick={this.passwordReset.bind(this)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                              <div className="buttonContainer_wTYxi">Send email</div>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    render() {
        return (
          <span>
                      {!!this.state.message ? <div className="errorMessage_2lxEG">{this.state.message.message}</div> : null}
              {this.renderForgetPasswordForm()}

              <div className="row login-via-email">
                              <button
                                onClick={(e)=>this.props.switchFormState(e, "MAIN")}
                                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  sign in with Facebook, Twitter
                              </button>
                          </div>
                        </span>
        )
    }
}

UserForgetPassword.contextTypes = {
    messages: React.PropTypes.object
};

UserForgetPassword.displayName = "UserForgetPassword";

module.exports = UserForgetPassword;
