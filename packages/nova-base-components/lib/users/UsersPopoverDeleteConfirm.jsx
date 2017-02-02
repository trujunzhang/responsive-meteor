import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class UsersPopoverDeleteConfirm extends Component {
    constructor(props, context) {
        super(props);

        const {currentUser} = context;
        const confirmName = Users.getDisplayName(currentUser);

        this.state = this.initialState = {
            // Detail
            confirmName: confirmName,
            fade: false,
            value: '',
            isCalling: false
        };
        this.fadingDone = this.fadingDone.bind(this)
    }

    componentDidMount() {
        const elm = this.refs.input;
        elm.addEventListener('animationend', this.fadingDone)
    }

    componentWillUnmount() {
        const elm = this.refs.input;
        elm.removeEventListener('animationend', this.fadingDone)
    }

    fadingDone() {
        // will re-render component, removing the animation class
        this.setState({fade: false})
    }

    onConfirmClick() {
        if (this.state.isCalling) {
            return;
        }
        const {confirmName, value} = this.state;
        if (confirmName !== value) {
            this.setState({fade: true});
        } else {
            this.setState({isCalling: true});
            const {currentUser} = this.context;
            this.context.actions.call('users.remove', currentUser._id, (error, result) => {
                this.setState({isCalling: false});
                if (!!error) {
                    this.context.messages.flash('Delete the account failure!', "error");
                } else {
                    this.context.messages.dismissPopoverMenu();
                    this.context.messages.delayHomePage(this.props.router);
                }
            });
        }
    }

    onCancelClick() {
        this.context.messages.dismissPopoverMenu();
    }

    render() {
        const {confirmName, fade} = this.state;
        const hint =
          "We’re sorry to see you go. Once your account is deleted, all of your content" +
          "will be permanently gone, including your profile, stories, publications," +
          "notes, and responses. If you’re not sure about that, we suggest you deactivate" +
          "or contact yourfriends@medium.com instead. To confirm deletion, type your" +
          "username (" + confirmName + ") below:";
        const inputClass = "textInput textInput--large u-marginTop30 js-usernameConfirmation" + (fade ? ' shimmy-shake-show-warn' : '');
        return (
          <div className="overlay" id="user_profile_delete_popover_overlay">
              <button
                onClick={this.onCancelClick.bind(this)}
                className="button button--close button--chromeless u-baseColor--buttonNormal">
                  ×
              </button>
              <div className="overlay-dialog overlay-dialog--form overlay-dialog--animate js-overlayDialog"
                   tabIndex="-1">
                  <h3 className="overlay-title">Confirm account deletion</h3>
                  <div className="overlay-content">
                      <div>{hint}</div>
                      <input
                        ref='input'
                        value={this.state.value}
                        onChange={(e) => this.setState({value: e.target.value})}
                        type="text"
                        className={inputClass}/>
                  </div>
                  <div className="overlay-actions buttonSet">
                      <button className="button button--primary button--withChrome u-accentColor--buttonNormal button--overlayConfirm"
                              onClick={this.onConfirmClick.bind(this)}
                              title="Confirm account deletion"
                              aria-label="Confirm account deletion"
                              data-action="overlay-submit"
                              type="form">
                          Confirm deletion
                      </button>
                      <button
                        onClick={this.onCancelClick.bind(this)}
                        className="button button--withChrome u-baseColor--buttonNormal"
                        data-action="overlay-cancel">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
        )
    }

}

UsersPopoverDeleteConfirm.contextTypes = {
    actions: React.PropTypes.object,
    closeCallback: React.PropTypes.func,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersPopoverDeleteConfirm.displayName = "UsersEditForm";

module.exports = withRouter(UsersPopoverDeleteConfirm);
export default withRouter(UsersPopoverDeleteConfirm);
