import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Topics from "meteor/nova:topics";
import {ModalTrigger} from "meteor/nova:core";
import {FormattedMessage, intlShape} from 'react-intl';
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';


class AppAdminTopicsEditSingle extends Component {

    constructor(props) {
        super(props);
        let topic = this.props.topic;
        this.state = this.initialState = {
            // detail
            nameValue: topic.name ? topic.name : '',
            slugValue: topic.slug ? topic.slug : ''
        };
    }

    onBulkUpdateSubmitClick() {
        if (this.state.nameValue == "" || this.state.slugValue == "") {
            return;
        }
        let modifier = {
            name: this.state.nameValue, slug: this.state.slugValue
        };
        this.context.actions.call('topics.bulk.edit', [this.props.topic._id], modifier, (error, result) => {
            this.props.editSingleHook(error, result);
        });
    }

    render() {
        return (
          <tr className="inline-edit-row inline-editor">
              <td colSpan={5} className="colspanchange">

                  <fieldset>
                      <legend className="inline-edit-legend">Quick Edit</legend>
                      <div className="inline-edit-col">
                          <label>
                              <span className="title">Name</span>
                              <span className="input-text-wrap">
                                  <input type="text" name="name" className="ptitle"
                                         value={this.state.nameValue}
                                         onChange={(e) => this.setState({"nameValue": e.target.value})}
                                  />
                              </span>
                          </label>
                          <label>
                              <span className="title">Slug</span>
                              <span className="input-text-wrap">
                                  <input type="text" name="slug" className="ptitle"
                                         value={this.state.slugValue}
                                         onChange={(e) => this.setState({"slugValue": e.target.value})}
                                  />
                              </span>
                          </label>
                      </div>
                  </fieldset>

                  <p className="inline-edit-save submit">
                      <button type="button" className="cancel button-secondary alignleft" onClick={this.props.onEditSingleCancelClick}>Cancel</button>
                      <button type="button" className="save button-primary alignright" onClick={this.onBulkUpdateSubmitClick.bind(this)}>Update Topic</button>
                      <span className="spinner"/>
                      <span className="error"/>
                      <br className="clear"/>
                  </p>
              </td>
          </tr>
        )

    }
}

AppAdminTopicsEditSingle.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminTopicsEditSingle.displayName = "AppAdminTopicsEditSingle";

module.exports = withRouter(AppAdminTopicsEditSingle);
export default withRouter(AppAdminTopicsEditSingle);
