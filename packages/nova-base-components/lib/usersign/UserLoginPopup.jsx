import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

class UserLoginPopup extends Component {

    constructor(props) {
        super(props);

        const {comp} = this.props;
        const object = comp.object;
        const formState = (object["formState"] ? object["formState"] : "MAIN");

        this.state = this.initialState = {
            titles: {
                MAIN: "Login to",
                SIGNIN: "Enter your email address to sign in",
                REGISTER: "Sign up to",
                RESET_PASSWD: "Reset password",
                FORGET_PASSWD: "Forgot password"
            },
            formState: formState,
        };
    }

    switchFormState(event, state) {
        event.preventDefault();
        this.setState({formState: state});
    }

    renderLoginPanel() {
        const {formState} = this.state;
        switch (formState) {
            case "MAIN":
                return (
                  <Telescope.components.UserLoginMain switchFormState={this.switchFormState.bind(this)}/>
                );
            case "SIGNIN":
                return (
                  <Telescope.components.UsersLoginPasswordless switchFormState={this.switchFormState.bind(this)}/>
                );
            case "REGISTER":
                return (
                  <Telescope.components.UserEmailSignUp switchFormState={this.switchFormState.bind(this)}/>
                );
            case "RESET_PASSWD":
                return (
                  <Telescope.components.UserResetPassword switchFormState={this.switchFormState.bind(this)}/>
                );
            case "FORGET_PASSWD":
                return (
                  <Telescope.components.UserForgetPassword switchFormState={this.switchFormState.bind(this)}/>
                );
            case "SEND_EMAIL_RESULT":
                return (
                  <Telescope.components.UsersLoginPasswordlessResult switchFormState={this.switchFormState.bind(this)}/>
                );
            case "USERNAME_FORM":
                return (
                  <Telescope.components.UserNameForm switchFormState={this.switchFormState.bind(this)} comp={this.props.comp}/>
                );
        }
    }

    renderCloseIcon() {
        return (
          <a className="modal--close v-desktop" onClick={() => this.context.messages.dismissPopoverMenu()} title="Close">

              <span>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M6 4.586l4.24-4.24c.395-.395 1.026-.392 1.416-.002.393.393.39 1.024 0 1.415L7.413 6l4.24 4.24c.395.395.392 1.026.002 1.416-.393.393-1.024.39-1.415 0L6 7.413l-4.24 4.24c-.395.395-1.026.392-1.416.002-.393-.393-.39-1.024 0-1.415L4.587 6 .347 1.76C-.05 1.364-.048.733.342.343c.393-.393 1.024-.39 1.415 0L6 4.587z"/>
                  </svg>
              </span>
          </a>
        )
    }

    render() {
        const {formState} = this.state;
        const {comp}=this.props;
        const {showCloseIcon, title, subtitle} = comp.object;
        if (formState == "SEND_EMAIL_RESULT" || formState == "SIGNIN" || formState == "USERNAME_FORM") {
            return (
              <div className="modal-overlay v-fullscreen">
                  {this.renderLoginPanel()}
                  {showCloseIcon ? this.renderCloseIcon() : null}

              </div>)
        }

        const formTitle = this.state.titles[formState];
        const extTitle = title === "" ? "Politicl" : title;

        return (
          <div className="modal-overlay v-fullscreen" id="popover_for_loginui">
              <div className="modal--content">
                  <div className="login-fullscreen">
                      <h2 className="login-fullscreen--title">
                          {formTitle + " " + extTitle}
                      </h2>
                      <p className="login-fullscreen--intro">Politicl is a news platform that brings together high quality news from across India. </p>
                      {this.renderLoginPanel()}
                  </div>
              </div>

              {showCloseIcon ? this.renderCloseIcon() : null}

          </div>
        )
    }
}

UserLoginPopup.contextTypes = {
    messages: React.PropTypes.object
};

UserLoginPopup.displayName = "UserLoginPopup";

module.exports = UserLoginPopup;
