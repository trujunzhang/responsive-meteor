import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserEmailSignIn extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            username: "",
            email: "",
            password: "",
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

    passwordReset() {
        const {email = '', waiting} = this.state;

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

    passwordChange() {
        const {
          password,
          newPassword
        } = this.state;

        if (!validatePassword(newPassword)) {
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
                    this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
                }
                else {
                    this.showMessage(T9n.get('info.passwordChanged'), 'success', 5000);
                    this.setState({formState: STATES.PROFILE});
                }
            });
        }
    }

    validateUsername(username) {
        if (username) {
            return true;
        }
        else {
            this.showMessage(T9n.get("error.usernameRequired"), 'warning');
            if (this.state.formState == STATES.SIGN_UP) {
                this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
            }

            return false;
        }
    }

    validateEmail(email) {
        if (email.indexOf('@') !== -1) {
            return true;
        }
        else {
            this.showMessage(T9n.get("error.accounts.Invalid email"), 'warning');
            if (this.state.formState == STATES.SIGN_UP) {
                this.state.onSubmitHook("error.accounts.Invalid email", this.state.formState);
            }

            return false;
        }
    }

    onSignedInHook() {
        this.context.messages.dismissPopoverMenu();
    }

    signIn() {
        const {
          username = null,
          email = null,
          usernameOrEmail = null,
          password
        } = this.state;

        let loginSelector;

        if (usernameOrEmail !== null) {
            // XXX not sure how we should validate this. but this seems good enough (for now),
            // since an email must have at least 3 characters anyways
            if (!this.validateUsername(usernameOrEmail)) {
                return;
            }
            else {
                loginSelector = usernameOrEmail;
            }
        }
        else if (email !== null && usernameOrEmail == null) {
            if (!this.validateEmail(email)) {
                return;
            }
            else {
                loginSelector = {email};
            }
        } else {
            throw new Error("Unexpected -- no element to use as a login user selector");
        }

        Meteor.loginWithPassword(loginSelector, password, (error, result) => {
            if (error) {
                this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
            }
            else {
                this.onSignedInHook();
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
                          <input type="email" name="email"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                                 placeholder="yourname@example.com"
                                 value={this.state.email}
                                 onChange={(e) => this.setState({"email": e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="overlay-content">
                      <div className="u-paddingTop10">Password</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="password" name="password"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-password"
                                 placeholder="Password"
                                 value={this.state.password}
                                 onChange={(e) => this.setState({"password": e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
                      <div className="login-in-left-buttons">
                          <div className="login-via-email">
                              <button
                                id="reset-password-button"
                                onClick={(e) => this.props.switchFormState(e, "RESET_PASSWD")}
                                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  Reset password
                              </button>
                              <button
                                onClick={(e) => this.props.switchFormState(e, "FORGET_PASSWD")}
                                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  Forget password
                              </button>
                          </div>
                      </div>
                      <div className="buttonWithNotice_3bRZb">
                          <button
                            onClick={this.signIn.bind(this)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                              <div className="buttonContainer_wTYxi">Login</div>
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
              {this.renderSignInForm()}

              <div className="row login-via-email">
                          <button
                            onClick={(e) => this.props.switchFormState(e, "REGISTER")}
                            className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  sign up with Email
                          </button>
                      </div>
                      <div className="row login-via-email">
                              <button
                                onClick={(e) => this.props.switchFormState(e, "MAIN")}
                                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                                  sign in with Facebook, Twitter
                              </button>
                          </div>
                        </span>
        )
    }
}

UserEmailSignIn.contextTypes = {
    messages: React.PropTypes.object
};

UserEmailSignIn.displayName = "UserEmailSignIn";

module.exports = UserEmailSignIn;
