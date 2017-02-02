import React, {PropTypes, Component} from 'react';
import Flags from 'meteor/nova:flags';
import {withRouter} from 'react-router';

import TextareaAutosize from 'react-textarea-autosize';

class SubmitFlagPopover extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            value: "",
            showError: false,
            isEventCalling: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.showError == true) {
            this.setState({showError: false});
        }
    }

    onSubmitFlagClick(event) {
        event.preventDefault();

        if (this.state.isEventCalling) {
            return;
        }
        this.setState({isEventCalling: true});

        const {comp} = this.props,
          object = comp.object,
          {currentUser} = this.context;

        this.context.actions.call('flags.new', {
            postId: object.postId,
            authorId: object.authorId,
            reason: this.state.value,
            userId: currentUser._id,
            type: Flags.config.TYPE_POST
        }, (error, result) => {
            this.setState({isEventCalling: false});
            if (!!error) {
                this.context.messages.flash("Submit flag failure!", "error");
            } else {
                this.context.messages.dismissPopoverMenu();
                this.context.messages.flash("Submit flag successfully!", "success");
            }
        });
    }

    render() {
        const {comp} = this.props,
          top = comp.top + comp.height + 4,
          left = (comp.left + comp.width / 2) + 70,
          object = comp.object;

        return (
          <div className="popover v-bottom-center" style={{top: top, left: left}}>
              <form className="popover_1ijp3" id="submit-flag-form">
                  <p className="featured_2W7jd default_tBeAo base_3CbW2">
                      Flag
                      <span className="productTitle_3NeF0">{object.title}</span>
                  </p>
                  {this.state.showError ? <div className="errorMessage_2lxEG">Form can't be blank.</div> : null}
                  <TextareaAutosize
                    useCacheForDOMMeasurements
                    minRows={3}
                    maxRows={10}
                    value={this.state.value}
                    onChange={(e) => {
                        this.setState({value: e.target.value});
                    }}
                    placeholder="Why should this be removed?"/>
                  <button
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf"
                    onClick={this.onSubmitFlagClick.bind(this)}>
                      <div className="buttonContainer_wTYxi">Submit</div>
                  </button>
              </form>
          </div>
        )
    }

}

SubmitFlagPopover.propTypes = {
    user: React.PropTypes.object
};

SubmitFlagPopover.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(SubmitFlagPopover);
export default withRouter(SubmitFlagPopover);
