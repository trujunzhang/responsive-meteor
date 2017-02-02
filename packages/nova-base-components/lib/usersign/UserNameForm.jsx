import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class UserNameForm extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            username: "",
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
        this.props.router.replace({pathname: '/'});
        this.context.messages.dismissPopoverMenu();
    }

    onSignUpClick() {
        var options = {};
        const {
          username = null,
          usernameOrEmail = null,
          formState
        } = this.state;

        const email = this.props.loginProps["email"];
        const password = this.props.loginProps["password"];

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

        //if (!this.validatePassword(password)) {
        //    this.showMessage(T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength), 'warning');
        //    //this.state.onSubmitHook("error.minChar", formState);
        //    return;
        //}
        //else {
        options.password = password;
        //}

        this.setState({waiting: true});

        // Allow for Promises to return.
        this.SignUpWithOptions(options);
    }

    SignUpWithOptions(_options) {
        Accounts.createUser(_options, (error) => {
            if (error) {
                this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
                if (T9n.get(`error.accounts.${error.reason}`)) {
                    //this.state.onSubmitHook(`error.accounts.${error.reason}`, formState);
                }
                else {
                    //this.state.onSubmitHook("Unknown error", formState);
                }
            }
            else {
                this.onPostSignUpHook();
            }
            this.setState({waiting: false});
        });
    }

    renderSignInForm() {
        return (
          <div id="user-signin-panel" className="overlay--dark">
              <div className="overlay-dialog--value">
                  <div className="overlay-content">
                      <div className="u-paddingTop10">User Name</div>
                      <div className="inputGroup u-marginBottom0">
                          <input type="value" name="value" className="textInput textInput--large u-marginBottom0 textInput--underlined textInput--signin js-value" placeholder="your name" value={this.state.username} onChange={(e) => this.setState({"username": e.target.value})}/>
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
                    className="button button--withChrome u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--withIconAndLabel button button--signin button--value button--overlayConfirm"
                    title="value me a link to sign in">
                      <div>
                          <span className="button-label js-buttonLabel">sign up</span>
                      </div>
                  </button>
              </div>
          </div>
        )
    }

    render() {
        return (
          <div className="overlay-dialog overlay-dialog--update overlay-dialog--alert overlay-dialog--animate js-overlayDialog" id="passwordless-form">
              <h3 className="overlay-title">Enter your user name to create an account on Politicl completely</h3>
              <span>
                {!!this.state.message
                  ? <div className="errorMessage_2lxEG">{this.state.message.message}</div>
                  : null}
                  {this.renderSignInForm()}
                  <div className="overlay-actions buttonSet">
                      <button
                        onClick={this.onSignUpClick.bind(this)}
                        id="sign-up-button"
                        className="button button--primary button--withChrome u-accentColor--buttonNormal">
                          sign up
                  </button>
              </div>
            </span>


              <div className="overlay-footer">
                  <a className="link u-baseColor--link" href="/login-faq" target="_blank">Having trouble signing in?</a>
              </div>
          </div>
        )
    }
}

UserNameForm.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

UserNameForm.displayName = "UserNameForm";

module.exports = withRouter(UserNameForm);
export default withRouter(UserNameForm);

