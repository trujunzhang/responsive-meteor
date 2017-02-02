import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UsersLoginPasswordlessResult extends Component {

    onOkClick() {
        this.context.messages.dismissPopoverMenu();
    }

    render() {
        return (
          <div className="overlay-dialog overlay-dialog--update overlay-dialog--alert overlay-dialog--animate js-overlayDialog" id="passwordless-result">
              <div className="overlay-title">
                  <img id="politicl-logo" width="98" height="32" src="/packages/public/images/politicl-logo.png"/>
              </div>
              <div className="overlay-content">We sent you a link to create an account. Please check your inbox.</div>
              <div className="overlay-actions buttonSet">
                  <button
                    onClick={this.onOkClick.bind(this)}
                    className="button button--primary button--withChrome u-accentColor--buttonNormal">
                      OK
                  </button>
              </div>
              <div className="overlay-footer">
                  <a className="link u-baseColor--link" href="/login-faq" target="_blank">Having trouble signing in?</a>
              </div>
          </div>
        )
    }
}

UsersLoginPasswordlessResult.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersLoginPasswordlessResult.displayName = "UserEmailResetPassword";

module.exports = UsersLoginPasswordlessResult;
