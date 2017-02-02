import Telescope from 'meteor/nova:lib';
import {Accounts} from 'meteor/accounts-base';
import {T9n} from 'meteor/softwarerero:accounts-t9n';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Users from 'meteor/nova:users';

class UsersPasswordlessVerify extends Component {

    constructor(props) {
        super(props);

        const query = props.router.location.query;
        const token = query.token;

        this.state = this.initialState = {
            isVerify: false,
            token: token,
            // Message
            message: null,
        };
    }

    componentDidMount() {
        const {isVerify, token} = this.state;
        if (isVerify) {
            return
        }
        this.setState({isVerify: true});

        if (token) {
            this.context.actions.call('verification.email.token', token, (error, result) => {
                if (!error) {
                    const userId = result.userId;
                    const email = result.email;
                    const password = result.password;
                    if (!!userId) {
                        const loginSelector = {email};
                        this.signIn(loginSelector, password);
                    } else {
                        let options = {};
                        options.email = email;
                        options.password = password;
                        //this.SignUpWithOptions(options);
                        this.context.messages.showLoginUI({formState: 'USERNAME_FORM', email: email, password: password});
                    }
                }
            });
        }
    }

    signIn(loginSelector, password) {
        Meteor.loginWithPassword(loginSelector, password, (error, result) => {
            if (error) {
                //this.showMessage(T9n.get(`error.accounts.${error.reason}`) || T9n.get("Unknown error"), 'error');
            }
            else {
                this.props.router.replace({pathname: '/'});
            }
        });
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
                //this.props.router.replace({pathname: '/users/my/edit'});
                //this.context.messages.showLoginUI({formState:'USERNAME_FORM'});

            }
        });
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

    render() {
        return (
          <div></div>
        )
    }
}

UsersPasswordlessVerify.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersPasswordlessVerify.displayName = "UserEmailResetPassword";

module.exports = UsersPasswordlessVerify;
