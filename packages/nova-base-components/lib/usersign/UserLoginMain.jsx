import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UserLoginMain extends Component {

    oauthSignIn(serviceName) {
        //const {formState, waiting, user} = this.state;
        //Thanks Josh Owens for this one.
        function capitalService() {
            return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
        }

        if (serviceName === 'meteor-developer') {
            serviceName = 'meteorDeveloperAccount';
        }

        const loginWithService = Meteor["loginWith" + capitalService()];

        let options = {}; // use default scope unless specified
        if (Accounts.ui._options.requestPermissions[serviceName])
            options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
        if (Accounts.ui._options.requestOfflineToken[serviceName])
            options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
        if (Accounts.ui._options.forceApprovalPrompt[serviceName])
            options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

        let self = this;
        loginWithService(options, (error, result) => {
            if (error) {
                self.context.messages.flash("You logged failure!", "error");
            } else {
                if (serviceName == "twitter") {
                    const modifier = "";
                    //this.context.actions.call('users.edit', modifier, () => {
                    //    this.context.events.track("post downvote cancelled", {'_id': post._id});
                    //});
                }
                //self.context.messages.dismissPopoverMenu();
            }
        });
    }

    loginTwitter() {
        this.context.messages.dismissPopoverMenu();
        Meteor.setTimeout(() => {
            this.oauthSignIn("twitter");
        }, 4);
    }

    loginFacebook() {
        this.context.messages.dismissPopoverMenu();
        Meteor.setTimeout(() => {
            this.oauthSignIn("facebook");
        }, 4);
    }

    renderLoginViaEmail() {
        return (
          <div className="row login-via-email">
              <button
                onClick={(e) => this.props.switchFormState(e, "SIGNIN")}
                className="button button--primary button--large button--chromeless button--link u-accentColor--buttonNormal u-marginTop15">
                  Sign in or sign up with email
              </button>
          </div>
        )
    }

    render() {
        return (
          <span>
                <div className="buttonGroup_1mB5C">
                    <a className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d twitterSolidColor_G22Bs solidVariant_2wWrf"
                       rel="login-with-twitter"
                       onClick={this.loginTwitter.bind(this)}>
                        <div className="buttonContainer_wTYxi">Log in with twitter</div>
                    </a>
                    <a className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d facebookSolidColor_pdgXp solidVariant_2wWrf"
                       rel="login-with-facebook"
                       onClick={this.loginFacebook.bind(this)}>
                        <div className="buttonContainer_wTYxi">Log in with facebook</div>
                    </a>
                </div>
              {/*{this.renderLoginViaEmail()}*/}
              <p className="login-fullscreen--login-info">We'll never post to Twitter or Facebook without your permission.</p>
            </span>
        )
    }
}

UserLoginMain.contextTypes = {
    messages: React.PropTypes.object
};

UserLoginMain.displayName = "UserLoginMain";

module.exports = UserLoginMain;
