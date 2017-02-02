import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class UsersInvites extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            email: '',
            // Message
            message: null,
            messagexxx: {
                message: "invalid email",
                type: "error"
            },
        };
    }

    showMessage(message, type, clearTimeout) {
        message = message.trim();

        if (message) {
            this.setState({
                message: {
                    message: message,
                    type: type
                }
            });
            if (clearTimeout) {
                Meteor.setTimeout(() => {
                    this.setState({message: null});
                }, clearTimeout);
            }
        }
    }

    onSenderInviteClick() {
        if (this.state.email == "" || this.state.email.indexOf('@') === -1) {
            this.showMessage("invalid email", 'error');
            return;
        }

        this.context.actions.call('invite.with.email', this.state.email, (error, result) => {
            if (!!error) {
                this.showMessage(error.error, 'error');
            } else {
                this.setState({email: ""});
            }
        });

    }

    renderMessage() {
        return (
          <div className="boxContent_2e30p">
              <span className="errorMessage_2lxEG">{this.state.message.message}</span>
          </div>
        )
    }

    renderHeaderInfo() {
        return (
          <div className="header_2cWfu">
              <span className="title_3pWZT headline_azIav default_tBeAo base_3CbW2">Invites</span>
              <span className="description_HGb5o featured_2W7jd default_tBeAo base_3CbW2">A limited number of people have access to comment and post on Product Hunt to maintain a healthy volume of submissions each day and thoughtful dialogue.</span>
          </div>
        )
    }

    render() {
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <div className="fullWidthBox_3Dggh box_c4OJj">
                  <div className="content_DcBqe">
                      {!!this.state.message ? this.renderMessage() : null}
                      {this.renderHeaderInfo()}
                      <div className="content_3YO6a">
                          <div className="invitesForm_1Npul">
                              <span className="title_2vHSk default_tBeAo base_3CbW2">Invite someone</span>
                              <div className="invitesLeft_2K4ES">No invites left</div>
                              <input type="email"
                                     id="user_invite_someone"
                                     className="input_pBYVu"
                                     name="invite_email"
                                     value={this.state.email}
                                     onChange={(e)=>this.setState({"email": e.target.value})}
                                     placeholder="Someone's email."/>
                              <button
                                onClick={this.onSenderInviteClick.bind(this)}
                                disabled={this.state.email == ""}
                                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf">
                                  <div className="buttonContainer_wTYxi">Invite</div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

}

UsersInvites.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersInvites.displayName = "UsersInvites";

module.exports = withRouter(UsersInvites);
export default withRouter(UsersInvites);
