import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import Users from "meteor/nova:users";
import TextareaAutosize from 'react-textarea-autosize';

class CommentsNew extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            input: ''
        }
    }

    onCancelComment(event) {
        this.props.cancelCallback(event);
    }

    onSubmitComment(event) {

        let prefilledProps = {postId: this.props.postId};

        if (this.props.parentComment) {
            prefilledProps = Object.assign(prefilledProps, {
                parentCommentId: this.props.parentComment._id,
                // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
                topLevelCommentId: this.props.parentComment.topLevelCommentId || this.props.parentComment._id
            });
        }

        prefilledProps["body"] = this.state.input;

        this.context.actions.call('comments.new', prefilledProps, (error, result) => {
            if(!!error){
                if(error.error==="CommentsNewRateLimit"){
                    this.context.messages.flash("You must submit next comment more than 15 seconds","error"); 
                }
            }else{
                this.setState({input: ''});
                this.props.successCallback();
                if (!!this.props.type && this.props.type === "reply") {
                    this.props.cancelCallback(event);
                }
            }
        });
    }

    renderSubmitButton() {
        let cancelButton = (
          <label
            className="comment-cancel"
            type="submit"
            onClick={this.onCancelComment.bind(this)}>
              <div className="buttonContainer_wTYxi">cancel</div>
          </label>);

        //{!!this.props.type && this.props.type === "xxreply" ? cancelButton : cancelButton}

        if (this.state.input) {
            return (
              <div className="actions_3Bypq row_kN1zc">
                  <button
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
                    type="submit"
                    onClick={this.onSubmitComment.bind(this)}>
                      <div className="buttonContainer_wTYxi">submit</div>
                  </button>
              </div>
            )
        }
        return null;
    }

    render() {

        const avatarObj = Users.getAvatarObj(this.context.currentUser);
        return (
          <div className="newForm_1CM9h form_1KXqk box_2b3oc">
              <label className="row_kN1zc text_3Wjo0 default_tBeAo base_3CbW2">
                  <span className="user-image userImage_1vOVg">
                  <Telescope.components.UsersBlurryImageAvatar
                    avatarObj={avatarObj}
                    size={32}/>
                  </span>
                  <TextareaAutosize
                    className="input_2rQLy comment-input"
                    placeholder="What do you think of this article…"
                    useCacheForDOMMeasurements
                    minRows={1}
                    value={this.state.input}
                    onChange={e => this.setState({input: e.target.value})}
                  />
              </label>

              {this.renderSubmitButton()}
          </div>

        )
    }

    renderxxx() {

        let prefilledProps = {postId: this.props.postId};

        if (this.props.parentComment) {
            prefilledProps = Object.assign(prefilledProps, {
                parentCommentId: this.props.parentComment._id,
                // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
                topLevelCommentId: this.props.parentComment.topLevelCommentId || this.props.parentComment._id
            });
        }

        return (
          <div className="comments-new-form">
              <NovaForm
                collection={Comments}
                currentUser={this.context.currentUser}
                methodName="comments.new"
                prefilledProps={prefilledProps}
                successCallback={this.props.successCallback}
                layout="elementOnly"
                cancelCallback={this.props.type === "reply" ? this.props.cancelCallback : null}
              />
          </div>
        )
    }

}

CommentsNew.propTypes = {
    postId: React.PropTypes.string.isRequired,
    type: React.PropTypes.string, // "comment" or "reply"
    parentComment: React.PropTypes.object, // if reply, the comment being replied to
    parentCommentId: React.PropTypes.string, // if reply
    topLevelCommentId: React.PropTypes.string, // if reply
    successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
    cancelCallback: React.PropTypes.func
};

CommentsNew.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object
};

module.exports = CommentsNew;
