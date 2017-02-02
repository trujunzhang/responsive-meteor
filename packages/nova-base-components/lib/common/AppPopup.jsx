import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router'

const excludeSelectors = [
    "#save_to_folders_button",
    "#submit-flag-form",
    "#post-detail-submit-flag",
    "#post-detail-header-save-button",
    "#userCollectionPanel",
    "#addNewCollectionButton",
    "#newCollectionForm",
    ".additionalActionButtons_BoErh",
    "#header_right_metamenu",
    // UsersPopoverMenu
    "#user-menu",
    "#medium-popover-user-menus",

    "#moreTopicsButton",
    "#messagesButton",
    "#signin_signup_button",
    "a.collections-popover--collection.popover--scrollable-list--element"
];

class AppPopup extends Component {
    constructor(props, context) {
        super(props);

        this.state = this.initialState = {
            didMount: false
        };
    }

    needCheckClickEvent() {
        return !($("#popover_for_loginui").length > 0 || $("#user_profile_delete_popover_overlay").length > 0)
    }

    componentDidMount() {
        this.setState({didMount: true});

        const {messages} = this.context;
        const self = this;
        $(document).bind('click touch', function (event) {
            //let back = $(event.target).parents().addBack();

            if ($("#show_popover_menu").length > 0) {
                const needCheckClickEvent = self.needCheckClickEvent();
                if (!!needCheckClickEvent) {
                    let isClicked = true;
                    excludeSelectors.forEach(
                      function addNumber(selector) {
                          if ($(event.target).parents().addBack().is(selector)) {
                              isClicked = false;
                          }
                      }
                    );
                    if (isClicked) {
                        messages.dismissPopoverMenu();
                    }
                }
            }
        });
    }

    renderMenu(popoverMenu) {
        switch (popoverMenu.type) {
            case "MoreButton":
                return (<Telescope.components.HeaderPopoverMenu comp={popoverMenu}/>);
            case "LoggedUserMenu":
                return (<Telescope.components.UsersPopoverMenu comp={popoverMenu}/>);
            case "SaveButton":
                return (<Telescope.components.UserCollectionsPopover comp={popoverMenu}/>);
            case "moreTopicsList":
                return (<Telescope.components.MoreTagsPopoverMenu comp={popoverMenu}/>);
            case "submitFlag":
                return (<Telescope.components.SubmitFlagPopover comp={popoverMenu}/>);
            case "messagesList":
                return (<Telescope.components.MessagesListPopover comp={popoverMenu}/>);
            case "UserDeleteConfirm":
                return (<Telescope.components.UsersPopoverDeleteConfirm comp={popoverMenu}/>);
            case "LoginUI":
                return (<Telescope.components.UserLoginPopup comp={popoverMenu}/>);
            default:
                return null;
        }
    }

    render() {
        const {popoverMenu} = this.props;
        if (this.state.didMount) {
            document.body.className = (!!popoverMenu && (popoverMenu.type === "LoginUI" || popoverMenu.type === "UserDeleteConfirm") ? "no-scroll" : "");
        }
        if (popoverMenu) {
            return (
              <div id="show_popover_menu">
                  {this.renderMenu(popoverMenu)}
              </div>
            )
        }

        return null;
    }

}

AppPopup.contextTypes = {
    messages: React.PropTypes.object
};

AppPopup.displayName = "AppPopup";

module.exports = AppPopup;
export default AppPopup;
