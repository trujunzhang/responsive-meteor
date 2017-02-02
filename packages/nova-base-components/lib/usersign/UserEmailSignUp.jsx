import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserEmailSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            username: null,
            email: "",
            usernameOrEmail: "",
            password: "",
            formState: "",
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

    validateUsername(username) {
        if (username) {
            return true;
        }
        else {
            this.showMessage(T9n.get("error.usernameRequired"), 'warning');
            //if (this.state.formState == STATES.SIGN_UP) {
            //this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
            //}

            return false;
        }
    }

    validateEmail(email) {
        if (email.indexOf('@') !== -1) {
            return true;
        }
        else {
            this.showMessage(T9n.get("error.accounts.Invalid email"), 'warning');
            //if (this.state.formState == STATES.SIGN_UP) {
            //    this.state.onSubmitHook("error.accounts.Invalid email", this.state.formState);
            //}

            return false;
        }
    }

    validatePassword(password) {
        if (password.length >= Accounts.ui._options.minimumPasswordLength) {
            return true;
        } else {
            return false;
        }
    }

    onPostSignUpHook() {
        this.context.messages.dismissPopoverMenu();
    }

    signUp() {
        var options = {};
        const {
          username = null,
          email = null,
          usernameOrEmail = null,
          password,
          formState
        } = this.state;

        if (username !== null) {
            if (!this.validateUsername(username)) {
                return;
            }
            else {
                options.username = username;
            }
        }

        if (email !== null) {
            if (!this.validateEmail(email)) {
                return;
            }
            else {
                options.email = email;
            }
        }

        if (!this.validatePassword(password)) {
            this.showMessage(T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength), 'warning');
            //this.state.onSubmitHook("error.minChar", formState);
            return;
        }
        else {
            options.password = password;
        }

        this.setState({waiting: true});

        // Allow for Promises to return.
        this.SignUpWithOptions(options);
    }

    SignUpWithOptions(_options) {
        Accounts.createUser(_options, (error) => {
            if (error) {
                this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
                if (T9n.get(`error.accounts.${error.reason}`)) {
                    this.state.onSubmitHook(`error.accounts.${error.reason}`, formState);
                }
                else {
                    this.state.onSubmitHook("Unknown error", formState);
                }
            }
            else {
                this.onPostSignUpHook();
            }

            this.setState({waiting: false});
        });
    }

    renderSignupForm() {
        return (
          <div id="user-signin-panel" className="overlay--dark">
              <div className="overlay-dialog--email">
                  <div className="overlay-content">
                      <div className="u-paddingTop10">User name</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="text" name="text"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                                 placeholder="Your user name"
                                 value={this.state.username}
                                 onChange={(e)=>this.setState({username: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="overlay-content">
                      <div className="u-paddingTop10">Email address</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="email" name="email"
                                 className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-email"
                                 placeholder="yourname@example.com"
                                 value={this.state.email}
                                 onChange={(e)=>this.setState({email: e.target.value})}
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
                                 onChange={(e)=>this.setState({password: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM" id="user-submit-button-panel">
                      <div className="buttonWithNotice_3bRZb">
                          <button
                            onClick={this.signUp.bind(this)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf" type="submit">
                              <div className="buttonContainer_wTYxi">Sign up</div>
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
              {this.renderSignupForm()}
              <div className="row login-via-email">
                  <button
                    onClick={(e)=>this.props.switchFormState(e, "MAIN")}
                    className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                      Or sign in with Facebook, Twitter
                  </button>
              </div>
              {/*<p className="login-fullscreen--login-info">We'll never post to Twitter or Facebook without your permission.</p>*/}
          </span>
        )
    }
}

UserEmailSignUp.contextTypes = {
    messages: React.PropTypes.object
};

UserEmailSignUp.displayName = "UserEmailSignUp";

module.exports = UserEmailSignUp;
