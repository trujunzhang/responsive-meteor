import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            password: "",
            newPassword: "",
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

    validatePassword(password) {
        if (password.length >= Accounts.ui._options.minimumPasswordLength) {
            return true;
        } else {
            return false;
        }
    }

    passwordChange() {
        const {
          password,
          newPassword
        } = this.state;

        if (!this.validatePassword(newPassword)) {
            this.showMessage(T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength), 'warning');
            return;
        }

        let token = Accounts._loginButtonsSession.get('resetPasswordToken');
        if (!token) {
            token = Accounts._loginButtonsSession.get('enrollAccountToken');
        }
        if (token) {
            Accounts.resetPassword(token, newPassword, (error) => {
                if (error) {
                    this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
                }
                else {
                    this.showMessage(T9n.get('info.passwordChanged'), 'success', 5000);
                    this.setState({formState: STATES.PROFILE});
                    Accounts._loginButtonsSession.set('resetPasswordToken', null);
                    Accounts._loginButtonsSession.set('enrollAccountToken', null);
                }
            });
        }
        else {
            Accounts.changePassword(password, newPassword, (error) => {
                if (error) {
                    const message = !!error.reason ? error.reason : error.message;
                    this.showMessage(message, 'error');
                }
                else {
                    this.onResetPasswordHook();
                }
            });
        }
    }

    onResetPasswordHook() {
        this.context.messages.dismissPopoverMenu();
    }

    renderResetPasswordForm() {
        return (
          <div id="user-signin-panel" className="overlay--dark">
              <div className="overlay-dialog--email">
                  <div className="overlay-content">
                      <div className="u-paddingTop10">Old password</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="password" name="password"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                                 placeholder="Password"
                                 value={this.state.password}
                                 onChange={(e)=>this.setState({"password": e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="overlay-content">
                      <div className="u-paddingTop10">New password</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="password" name="password"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                                 placeholder="Password"
                                 value={this.state.newPassword}
                                 onChange={(e)=>this.setState({"newPassword": e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
                      <div className="buttonWithNotice_3bRZb">
                          <button
                            onClick={this.passwordChange.bind(this)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                              <div className="buttonContainer_wTYxi">Reset</div>
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
              {this.renderResetPasswordForm()}

              <div className="row login-via-email">
                              <button
                                onClick={(e)=>this.props.switchFormState(e, "SIGNIN")}
                                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  sign in with Email
                              </button>
                          </div>
                        </span>
        )
    }
}

UserResetPassword.contextTypes = {
    messages: React.PropTypes.object
};

UserResetPassword.displayName = "UserEmailResetPassword";

module.exports = UserResetPassword;
