import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';
import Folders from "meteor/nova:folders";
import {withRouter} from 'react-router'

class HeaderContent extends Component {

    constructor(props) {
        super(props);
    }

    popoverHeaderMenu() {
        let button = this.refs.moreButton;
        let top = button.offsetTop;
        let left = button.offsetLeft;
        let width = button.offsetWidth;
        let height = button.offsetHeight;
        this.context.messages.showPopoverMenu('MoreButton', {}, top, left, width, height);
    }

    onLogoIconClick() {
        this.context.messages.delayHomePage(this.props.router);
    }

    showLogin() {
        this.context.messages.showLoginUI();
    }

    onSubmitAnArticleClick() {
        this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {action: "new"}});
    }

    onBookmarkClick() {
        const currentUser = this.context.currentUser;
        const path = "/users/" + currentUser.telescope.slug + "/collections/" + currentUser.telescope.folderBookmarkId + "/" + Folders.getDefaultFolderName();
        this.context.messages.pushRouter(this.props.router, {pathname: path});
    }

    renderLeft() {
        return (
          <div className="metabar-block metabar-block--left u-floatLeft u-height65 u-xs-height56">
              <a onClick={this.onLogoIconClick.bind(this)} className="siteNav-logo">
                <span className="svgIcon svgIcon--logoNew svgIcon--45px is-flushLeft">
                    <img id="politicl-logo" width="98" height="32"
                         src='/packages/public/images/politicl-logo.png'>
                    </img>
              </span>
              </a>
          </div>
        )
    }

    renderBookmarkIcon() {
        return (
          <button
            onClick={this.onBookmarkClick.bind(this)}
            className="button button--chromeless is-touchIconFadeInPulse u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--bookmark js-bookmarkButton" title="Bookmark this story to read later">
                  <span className="button-defaultState">
                      <span className="svgIcon svgIcon--bookmark svgIcon--25px">
                          <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">
                              <path
                                d="M19 6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14.66h.012c.01.103.045.204.12.285a.5.5 0 0 0 .706.03L12.5 16.85l5.662 4.126a.508.508 0 0 0 .708-.03.5.5 0 0 0 .118-.285H19V6zm-6.838 9.97L7 19.636V6c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v13.637l-5.162-3.668a.49.49 0 0 0-.676 0z">
                              </path>
                          </svg>
                      </span>
                  </span>
              <span className="button-activeState">
                      <span className="svgIcon svgIcon--bookmarkFilled svgIcon--25px">
                          <svg className="svgIcon-use" width="25" height="26" viewBox="0 0 25 26">
                              <path d="M19 7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v14.66h.012c.01.103.045.204.12.285a.5.5 0 0 0 .706.03L12.5 17.85l5.662 4.126a.508.508 0 0 0 .708-.03.5.5 0 0 0 .118-.285H19V7z"/>
                          </svg>
                      </span>
                  </span>
          </button>
        )
    }

    onMessageButtonClick() {
        let offset = $(this.refs.messagesButton).offset();
        let top = offset.top + 14;
        let left = offset.left + 82;
        let width = 60;
        let height = 20;
        this.context.messages.showPopoverMenu("messagesList", {}, top, left, width, height);
    }

    renderNotification() {
        const {currentUser} = this.props;
        if (!currentUser)
            return null;

        const messagesLength = Users.getMessagesLength(currentUser);
        if (messagesLength !== 0) {
            return (
              <a
                ref="messagesButton"
                id="messagesButton"
                onClick={this.onMessageButtonClick.bind(this)}
                className="activityFeedButton_1xqM_ menuLink_1h9ZN">
                  <span className="activityFeedLabelUnseen_2t9sf menuLink_1h9ZN secondaryText_PM80d default_tBeAo base_3CbW2">{messagesLength}</span>
              </a>
            )
        }

        return (
          <button
            ref="messagesButton"
            id="messagesButton"
            onClick={this.onMessageButtonClick.bind(this)}
            className="button button--small button--circle button--chromeless is-touchIconBlackPulse is-inSiteNavBar u-baseColor--buttonNormal button--withIcon button--withSvgIcon button--activity js-notificationsButton"
            title="Notifications">

              <span className="svgIcon svgIcon--bell svgIcon--25px">
                  <svg className="svgIcon-use" width="25" height="25" viewBox="-293 409 25 25">
                      <path
                        d="M-273.327 423.67l-1.673-1.52v-3.646a5.5 5.5 0 0 0-6.04-5.474c-2.86.273-4.96 2.838-4.96 5.71v3.41l-1.68 1.553c-.204.19-.32.456-.32.734V427a1 1 0 0 0 1 1h3.49a3.079 3.079 0 0 0 3.01 2.45 3.08 3.08 0 0 0 3.01-2.45h3.49a1 1 0 0 0 1-1v-2.59c0-.28-.12-.55-.327-.74zm-7.173 5.63c-.842 0-1.55-.546-1.812-1.3h3.624a1.92 1.92 0 0 1-1.812 1.3zm6.35-2.45h-12.7v-2.347l1.63-1.51c.236-.216.37-.522.37-.843v-3.41c0-2.35 1.72-4.356 3.92-4.565a4.353 4.353 0 0 1 4.78 4.33v3.645c0 .324.137.633.376.85l1.624 1.477v2.373z"/>
                  </svg>
              </span>
          </button>
        )
    }

    renderRight() {
        const currentUser = this.context.currentUser;
        const writeClass =
          currentUser ?
            "button button--blue button--chromeless u-accentColor--buttonNormal is-inSiteNavBar u-sm-hide u-marginRight15 u-lineHeight30 u-height32" :
            "button button--chromeless u-baseColor--buttonNormal is-inSiteNavBar u-sm-hide u-marginRight15 u-lineHeight30 u-height32 is-touched";

        //Also change “Write a news” to “Submit an Article”
        //and change the color of the text to blue

        return (
          <div className="metabar-block metabar-block--right u-floatRight u-height65 u-xs-height56">
              <div className="buttonSet">

                  {!!currentUser ?
                    <a onClick={this.onSubmitAnArticleClick.bind(this)} id="header-submit-an-article" className={writeClass}>Submit an Article</a> : null}

                  {/*Show the login/signup button*/}
                  {currentUser ? null :
                    <a
                      id="signin_signup_button"
                      onClick={this.showLogin.bind(this)}
                      className="button button--primary button--chromeless u-accentColor--buttonNormal is-inSiteNavBar u-lineHeight30 u-height32 u-marginRight15 is-touched">
                        Sign in / Sign up
                    </a>
                  }

                  {/*Search Icon*/}
                  <Telescope.components.HeaderContentSearchBar/>

                  {/*Notification Icon*/}
                  {this.renderNotification()}

                  {currentUser ? this.renderBookmarkIcon() : null}

                  {/*Show the logged user Icon*/}
                  {currentUser ? <Telescope.components.UsersMenu /> : null}
              </div>
          </div>
        )
    }

    renderDebug() {
        return (
          <div>
              <Telescope.components.UsersAccountMenuBase/>
              <div>
                  <a onClick={(e) => {
                      this.context.messages.flash('login failure login failure', "error");
                  }}>
                      show failure
                  </a>
              </div>
              <div>
                  <a onClick={(e) => {
                      this.context.messages.flash('login successfully login successfully', "success");
                  }}>
                      show success
                  </a>
              </div>
          </div>
        );
    }

    render() {
        //{this.renderDebug()}
        return (
          <div className="headerContent_3umLL centerItems_222KX u-height65">
              {this.renderLeft()}
              {this.renderRight()}
          </div>
        )
    }

}

HeaderContent.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(HeaderContent);
export default withRouter(HeaderContent);
