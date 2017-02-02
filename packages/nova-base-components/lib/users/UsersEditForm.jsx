import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Users from 'meteor/nova:users';
import Mimages from "meteor/nova:mimages";

class UsersEditForm extends Component {

    /**
     * 17/12/2016
     *
     * Change "Biography" to "Bio", and limit it to 200 characters
     * User display image should be changeable. The user should be able to upload a new display image.
     * The cover image should be fetched automatically from Facebook/Twitter. And this should be changeable. The user should be able to upload a new cover image.
     * Change "News Letter" to "Newsletter"
     * Remove "Website"
     * Remove "My invites"
     * If user logins in via twitter, it should say "Twitter Account Connected".
     * If user logins in via Facebook, it should say "Facebook Account Connected"
     */

    constructor(props) {
        super(props);

        const {user} = this.props;
        const displayName = Users.getDisplayName(user),
              biography = user.telescope.bio ? user.telescope.bio : "",
              isSubscribed = Users.getSetting(user, 'newsletter.subscribed', false),
              email = Users.getEmail(user);

        this.state = this.initialState = {
            // Detail
            displayName: displayName,
            biography: biography,
            email: email,
            website: user.telescope.website,
            twitterUsername: user.telescope.twitterUsername,
            // Notification
            notifications_users: user.telescope.notifications_users,
            notifications_posts: user.telescope.notifications_posts,
            notifications_comments: user.telescope.notifications_comments,
            notifications_replies: user.telescope.notifications_replies,
            // newsletter
            newsletter_showBanner: user.telescope.newsletter.showBanner,
            newsletter_subscribed: user.telescope.newsletter.subscribed,
            // Message
            message: null,
            // Submit
            isSaving: false,
            // profile cover
            thumbnailValue: '',
            coverId: user.telescope.coverId,
            // Subscription status
            isSubscribed: isSubscribed
        };
    }

    onUpdateButtonClick() {
        const {user} = this.props;
        let editUser = {
            "telescope.displayName": this.state.displayName,
            "telescope.bio": this.state.biography,
            "telescope.email": this.state.email,
            "telescope.website": this.state.website,
            "telescope.twitterUsername": this.state.twitterUsername,
            // Notification
            "telescope.notifications_posts": this.state.notifications_posts,
            "telescope.notifications_comments": this.state.notifications_comments,
            "telescope.notifications_replies": this.state.notifications_replies,
            // newsletter
            "telescope.newsletter.showBanner": this.state.newsletter_showBanner,
            "telescope.newsletter.subscribed": this.state.newsletter_subscribed,
            // Cover
            "telescope.coverId": this.state.coverId
        };
        if (user.isAdmin) {
            // admin
            editUser['telescope.notifications_users'] = this.state.notifications_users;
        }
        this.setState({isSaving: true, message: {message:'',type:''}});
        const {isSubscribed} = this.state,
            subscribed = Users.getSetting(user, 'newsletter.subscribed', false);

       const needUpdateSubscription = isSubscribed !== subscribed; 

        this.context.actions.call('users.edit', this.props.user._id, {$set: editUser}, (error, result) => {
            if (!!error) {
                if (error.error == "email_taken2") {
                    this.setState({isSaving: false, message: {message: "this email is already token!", type: "error"}});
                } else {
                    this.setState({isSaving: false, message: {message: "Saved failure!", type: "error"}});
                }
            } else {
                if(needUpdateSubscription){
                    const action = Users.getSetting(this.props.user, 'newsletter.subscribed', false) ?
                                   'newsletter.removeUser' : 'newsletter.addUser';
                    this.context.actions.call(action, this.props.user, (error, result) => {
                        if (error) {
                            this.setState({isSaving: false, message: {message: "Newsletter failure!", type: "error"}});
                            //console.log(error); // eslint-disable-line
                            this.context.messages.flash(error.message, "error");
                        } else {
                            this.setState({isSaving: false, message: {message: "", type: "success"}});
                        }
                    });
                }else{
                    this.setState({isSaving: false, message: {message: "", type: "success"}});
                }
            }
        });
    }

    renderAvatar() {
        return (
          <label className="field_1LaJb">
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Profile Header</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <div className="mediaUpload_1A2VG">
                      <input type="text" id="url_header_uuid" placeholder="https://"/>
                      <input type="file" id="file_header_uuid" accept="image/gif, image/jpeg, image/png"/>
                      <input type="hidden" name="header_uuid" value=""/>
                  </div>
              </div>
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderAccountType() {
        return (
          <div className="paddedBox_2UY-S box_c4OJj">
              <div className="header_3GFef">
                  <span>
                  <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">Connect Accounts</span>
                  </span>
              </div>
              <div className="content_DcBqe"><p>You are logged in using Facebook.</p>
                  <p>
                      <a className="button_2I1re smallSize_1da-r secondaryText_PM80d twitterSolidColor_G22Bs solidVariant_2wWrf">
                          <div className="buttonContainer_wTYxi">Connect with Twitter</div>
                      </a>&nbsp;to find more friends &amp; followers.
                  </p>
              </div>
          </div>
        )
    }

    renderWebsite() {
        return (
          <label className="field_1LaJb">
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Website</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <input type="text"
                         name="url"
                         onChange={(e) => this.setState({website: e.target.value})}
                         value={this.state.website}/>
              </div>
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderAccountDetail() {
        return (
          <div className="paddedBox_2UY-S box_c4OJj">
              <div className="header_3GFef">
                  <span>
                      <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">My Details</span>
                  </span>
              </div>
              <div className="content_DcBqe">
                  <label className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Name</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <input type="text"
                                 name="name"
                                 onChange={(e) => this.setState({displayName: e.target.value})}
                                 value={this.state.displayName}/>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </label>
                  {/*Change "Biography" to "Bio", and limit it to 200 characters*/}
                  <label className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Bio</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <TextareaAutosize
                            maxLength={200}
                            useCacheForDOMMeasurements
                            style={{boxSizing: 'border-box'}}
                            maxRows={6}
                            value={this.state.biography}
                            onChange={e => this.setState({biography: e.target.value})}
                          />
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </label>
                  <label className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Email</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <input type="text"
                                 name="email"
                                 onChange={(e) => this.setState({email: e.target.value})}
                                 value={this.state.email}/>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </label>
                  {/*Remove "Website"*/}
                  {/*{this.renderWebsite()}*/}
                 {this.renderFeatureImage()}
              </div>
          </div>
        )
    }

    renderTwitterName(){
        return(
            <label className="field_1LaJb">
                <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Twitter Name</span>
                <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                    <input type="text"
                           name="name"
                           onChange={(e) => this.setState({twitterUsername: e.target.value})}
                           value={this.state.twitterUsername}/>
                </div>
                <hr className="ruler_1ti8u"/>
            </label>
        )
    }

    onConnectToFacebook() {
        const self = this;
        const options = {};
        Meteor.connectWithFacebook(options, function () {
            console.log(arguments);
            if (arguments.length > 0) {
                const argument = arguments[0];
                if (argument.length > 0) {
                    const errorClass = argument[0];
                    if (!!errorClass) {
                        self.context.messages.flash(errorClass.reason, "error");
                    }
                }
            }
        });
    }

    onConnectToTwitter() {
        const self = this;
        const options = {};
        Meteor.connectWithTwitter(options, function () {
            console.log(arguments);
            if (arguments.length > 0) {
                const argument = arguments[0];
                if (argument.length > 0) {
                    const errorClass = argument[0];
                    if (!!errorClass) {
                        self.context.messages.flash(errorClass.reason, "error");
                    }
                }
            }
        });
    }

    onDisconnectClick(type) {
        this.context.actions.call('users.disconnect.service', type, (error, result) => {
            if (!!error) {
            }
        });
    }

    generateConnections(type) {
        const {user} = this.props;
        const connectionObj = Users.getServiceInformation(user, type);
        switch (type) {
            case "facebook":
                const facebookTitle=
                    "Your Facebook friends (who are also on&nbsp;Politicl) have become part of your network on&nbsp;Politicl. We will never post to&nbsp;Facebook or message your friends without your permission.";
                if (!!connectionObj) {
                    const isLoggedViaType = (user.loginType == Users.config.TYPE_FACEBOOK);
                    return (
                      <section key={type} className="list-item list-item--padded">
                          <div className="list-itemInfo">
                              <h2 className="list-itemTitle">You are connected to Facebook</h2>
                              <p className="list-itemDescription">{facebookTitle}</p>
                          </div>
                          <div className="list-itemActions list-itemActions--facebook">
                              <img className="list-itemImage list-itemImage--facebook" src={connectionObj.url}/>
                              <span className="list-itemActionGroup">
                                  <span className="list-itemName list-itemName--facebook">{connectionObj.title}</span>
                                  <button
                                    onClick={this.onDisconnectClick.bind(this, type)}
                                    className="button button--chromeless u-baseColor--buttonNormal button--disconnect button--dangerHover js-facebookDisconnect"
                                    disabled={isLoggedViaType}>
                                      (disconnect)
                                  </button>
                                  <button className="button button--chromeless u-baseColor--buttonNormal button--disconnect u-hide js-disconnectFacebookHelp">How do I disconnect?</button>
                              </span>
                          </div>
                      </section>
                    )
                } else {
                    return (
                      <section key={type} className="list-item list-item--padded">
                          <div className="list-itemInfo">
                              <h2 className="list-itemTitle">Connect to Facebook</h2>
                              <p className="list-itemDescription">{facebookTitle}</p>
                          </div>
                          <div className="list-itemActions list-itemActions--facebook">
                              <button
                                onClick={this.onConnectToFacebook.bind(this)}
                                className="button button--withChrome u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--withIconAndLabel button--facebook button--signin js-facebookButton"
                                title="Connect your Facebook account to Politicl">
                              <span className="svgIcon svgIcon--facebookFilled svgIcon--21px">
                                  <svg className="svgIcon-use" width="21" height="21" viewBox="0 0 21 21">
                                      <path d="M18.26 10.55c0-4.302-3.47-7.79-7.75-7.79-4.28 0-7.75 3.488-7.75 7.79a7.773 7.773 0 0 0 6.535 7.684v-5.49h-1.89v-2.2h1.89v-1.62c0-1.882 1.144-2.907 2.814-2.907.8 0 1.48.06 1.68.087V8.07h-1.15c-.91 0-1.09.435-1.09 1.07v1.405h2.16l-.28 2.2h-1.88v5.515c3.78-.514 6.7-3.766 6.7-7.71"/>
                                  </svg>
                              </span>
                                  <span className="button-label  js-buttonLabel">Connect to Facebook</span>
                              </button>
                          </div>
                      </section>
                    )
                }

            case "twitter":
                const twitterTitle=
                    "Connections you have on Twitter (who are also on&nbsp;Politicl) have become part of your network on&nbsp;Politicl. We will never post to&nbsp;Twitter or message your followers without your permission.";
                if (!!connectionObj) {
                    const isLoggedViaType = (user.loginType == Users.config.TYPE_TWITTER);
                    return (
                      <section key={type} className="list-item list-item--padded">
                          <div className="list-itemInfo">
                              <h2 className="list-itemTitle">You are connected to Twitter</h2>
                              <p className="list-itemDescription">{twitterTitle}</p>
                          </div>
                          <div className="list-itemActions list-itemActions--twitter">
                              <img className="list-itemImage list-itemImage--twitter" src={connectionObj.url}/>
                              <span className="list-itemActionGroup">
                              <span className="list-itemName list-itemName--twitter">{"@" + connectionObj.title}</span>
                                  <button
                                    onClick={this.onDisconnectClick.bind(this, type)}
                                    className="button button--chromeless u-baseColor--buttonNormal button--disconnect button--dangerHover u-hide js-twitterDisconnect"
                                    disabled={isLoggedViaType}>
                                      (disconnect)
                                  </button>
                                  <button className="button button--chromeless u-baseColor--buttonNormal button--disconnect js-disconnectTwitterHelp">How do I disconnect?</button>
                          </span>
                          </div>
                      </section>
                    )
                } else {
                    return (
                      <section key={type} className="list-item list-item--padded">
                          <div className="list-itemInfo">
                              <h2 className="list-itemTitle">Connect to Twitter</h2>
                              <p className="list-itemDescription">{twitterTitle}</p>
                          </div>
                          <div className="list-itemActions list-itemActions--twitter">
                              <button
                                onClick={this.onConnectToTwitter.bind(this)}
                                className="button button--withChrome u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--withIconAndLabel button--twitter button--signin js-twitterButton"
                                title="Connect your Twitter account to Politicl">
                                  <span className="svgIcon svgIcon--twitterFilled svgIcon--21px">
                                      <svg className="svgIcon-use" width="21" height="21" viewBox="0 0 21 21">
                                          <path
                                            d="M18.502 4.435a6.892 6.892 0 0 1-2.18.872 3.45 3.45 0 0 0-2.552-1.12 3.488 3.488 0 0 0-3.488 3.486c0 .276.03.543.063.81a9.912 9.912 0 0 1-7.162-3.674c-.3.53-.47 1.13-.498 1.74.027 1.23.642 2.3 1.557 2.92a3.357 3.357 0 0 1-1.555-.44.15.15 0 0 0 0 .06c-.004 1.67 1.2 3.08 2.8 3.42-.3.06-.606.1-.934.12-.216-.02-.435-.04-.623-.06.42 1.37 1.707 2.37 3.24 2.43a7.335 7.335 0 0 1-4.36 1.49L2 16.44A9.96 9.96 0 0 0 7.355 18c6.407 0 9.915-5.32 9.9-9.9.015-.18.01-.33 0-.5A6.546 6.546 0 0 0 19 5.79a6.185 6.185 0 0 1-1.992.56 3.325 3.325 0 0 0 1.494-1.93"/>
                                      </svg>
                                  </span>
                                  <span className="button-label  js-buttonLabel">Connect to Twitter</span>
                              </button>
                          </div>
                      </section>
                    )
                }
        }
    }

    renderSocialAccounts() {
        let sections = [this.generateConnections("facebook"),this.generateConnections('twitter')];
        return (
          <div className="paddedBox_2UY-S box_c4OJj" id="user_profile_social">
              <div className="header_for_user_profile_social">
                  <span>
                      <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">Connections</span>
                  </span>
              </div>
              <div className="list u-marginBottom50">
                  {sections}
              </div>
          </div>
        )
    }

    renderNotification() {
        const {user} = this.props;
        return (
          <div className="paddedBox_2UY-S box_c4OJj">
              <div className="header_3GFef">
                  <span >
                      <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">Notifications</span>
                  </span>
              </div>
              <div className="content_DcBqe">
                  <div className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Email</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          {Users.isAdmin(user) ?
                            (<label className="notification_1AVqu">
                                <input type="checkbox" name="notifications_users"
                                       onChange={(e) => this.setState({"notifications_users": !this.state.notifications_users})}
                                       checked={this.state.notifications_users}/>
                                New Users Notifications
                            </label>)
                            : null}
                          <label className="notification_1AVqu">
                              <input type="checkbox" name="notifications_posts"
                                     onChange={(e) => this.setState({"notifications_posts": !this.state.notifications_posts})}
                                     checked={this.state.notifications_posts}/>
                              New Posts Notifications
                          </label>
                          <label className="notification_1AVqu">
                              <input type="checkbox" name="notifications_comments"
                                     onChange={(e) => this.setState({"notifications_comments": !this.state.notifications_comments})}
                                     checked={this.state.notifications_comments}/>
                              Comment Notifications
                          </label>
                          <label className="notification_1AVqu">
                              <input type="checkbox" name="notifications_replies"
                                     onChange={(e) => this.setState({"notifications_replies": !this.state.notifications_replies})}
                                     checked={this.state.notifications_replies}/>
                              Reply the comment Notifications
                          </label>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </div>
              </div>
          </div>
        )
    }

    onFeatureImageChange(thumbnailValue, coverId) {
        this.setState({thumbnailValue: thumbnailValue, coverId: coverId});
    }

    renderFeatureImage() {
        const {user} = this.props;
        const preview = Mimages.getUserCoverUrl(user);
        return (
          <div className="field_1LaJb" id="thumbnail">
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Profile Header</span>
              <Telescope.components.ArticleFeatureImage
                thumbnailValue={this.state.thumbnailValue}
                imageId={this.state.coverId}
                preview={preview}
                uploadType={"cover"}
                onFeatureImageChange={this.onFeatureImageChange.bind(this)}
              />
              <hr className="ruler_1ti8u"/>
          </div>
        )
    }

    renderNewsLetter() {
        //const {isSubscribed} = this.state;
        let title ="Subscribe to Politicl's Weekly Newsletter";
        //if (isSubscribed){
           //title = "Subscribed to Politicl's Weekly Newsletter"; 
        //}

        //Change "News Letter" to "Newsletter"
        return (
          <div className="paddedBox_2UY-S box_c4OJj">
              <div className="header_3GFef">
                  <span >
                      <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">Newsletter</span>
                  </span>
              </div>
              <div className="content_DcBqe">
                  <div className="field_1LaJb">
                      <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Subscription</span>
                      <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                          <label className="notification_1AVqu">
                                 <input type="checkbox"
                                     name="isSubscribed"
                                     onChange={(e) => this.setState({isSubscribed: !this.state.isSubscribed})}
                                     checked={this.state.isSubscribed}/>
                                     {title}
                           </label>
                      </div>
                      <hr className="ruler_1ti8u"/>
                  </div>
              </div>
          </div>
        )
    }

    renderHint() {
        const {message} = this.state;
        if (!!message) {
            if (message.type === "success") {
                return (
                  <span className="success_1BtDc secondaryText_PM80d default_tBeAo base_3CbW2">
                      <span>
                          Updated!
                      </span>
                  </span>
                );
            } else {
                return (
                  <span className="failure_mCTlk secondaryText_PM80d default_tBeAo base_3CbW2">
                      <span>
                          {"Oh-oh! " + this.state.message.message}
                      </span>
                  </span>
                );
            }

        }
        return null;
    }

    onDeleteAccountClick(event){
        this.context.messages.showPopoverMenu("UserDeleteConfirm",{});
    }

    renderDeleteAccount(){
        return(
          <div className="paddedBox_2UY-S box_c4OJj" id="user_profile_delete_account">
              <div className="header_for_user_profile_social">
                  <span>
                      <span className="title_38djq featured_2W7jd default_tBeAo base_3CbW2">Delete account</span>
                  </span>
              </div>
              <label className="field_1LaJb">
                  <div className="list u-marginBottom50">
                      <div className="list-item_delete_Info">
                          <p className="list-itemDescription">Permanently delete your account and all of your content.</p>
                          <button
                              onClick={this.onDeleteAccountClick.bind(this)}
                              className="button button--chromeless u-baseColor--buttonNormal button--delete"
                              data-action="request-delete-account">
                              Delete account
                          </button>
                      </div>
                  </div>
              <hr className="ruler_1ti8u"/>
              </label>
          </div>
        )
    }

    render() {
        const {isSaving} = this.state;
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <div>
                  {/*Header title*/}
                  <div className="headline_3NiTB headline_azIav default_tBeAo base_3CbW2">Settings</div>

                  {this.renderAccountDetail()}
                  {this.renderSocialAccounts()}
                  {this.renderNotification()}
                  {this.renderNewsLetter()}
                  {this.renderDeleteAccount()}

                  <div className="left_3jL0S buttonGroup_2NmU8">
                      {isSaving ?
                       (<button
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
                            disabled="">
                            <div className="buttonContainer_wTYxi">
                                <span>Update…</span>
                            </div>
                        </button>) :
                        (<button
                          onClick={this.onUpdateButtonClick.bind(this)}
                          className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                            <div className="buttonContainer_wTYxi">Update</div>
                        </button>)
                      }
                      {isSaving ?
                       (
                           <span className="submitting_1vFUc secondaryText_PM80d default_tBeAo base_3CbW2">
                               <span>Saving…</span>
                           </span>
                       ) : this.renderHint()}
                  </div>
              </div>
          </div>
        )
    }

}

UsersEditForm.contextTypes = {
    actions: React.PropTypes.object,
    closeCallback: React.PropTypes.func,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersEditForm.displayName = "UsersEditForm";

module.exports = UsersEditForm;
export default UsersEditForm;
