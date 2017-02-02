import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Categories from "meteor/nova:categories";
import Topics from "meteor/nova:topics";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';

class AppAdminCommentsEditSingle extends Component {

    constructor(props) {
        super(props);

        const {comment} = props;
        this.state = this.initialState = {
            input: comment.body
        };
    }

    onBulkUpdateSubmitClick() {

        const modifier = {
            $set: {
                body: this.state.input
            }
        };

        const {comment} = this.props;
        this.context.actions.call('comments.edit', comment._id, modifier, (error, result) => {
            this.props.editSingleHook(error, result);
        });
    }

    render() {
        return (
          <tr id="replyrow" className="inline-edit-row">
              <td colSpan="5" className="colspanchange" id="bulk-edit-row">
                  <fieldset className="comment-reply">
                      <legend>
                          <span className="hidden" id="editlegend">Edit Comment</span>
                      </legend>

                      <div id="replycontainer">
                          <label className="screen-reader-text">Comment</label>
                          <div id="wp-replycontent-wrap"
                               className="wp-core-ui wp-editor-wrap html-active">
                              <link rel="stylesheet"
                                    id="editor-buttons-css"
                                    type="text/css"
                                    media="all"/>
                              <div id="wp-replycontent-editor-container" className="wp-editor-container">
                                  <textarea
                                    className="wp-editor-area"
                                    rows="20"
                                    cols="40"
                                    name="replycontent"
                                    value={this.state.input}
                                    onChange={(e) => {
                                        this.setState({input: e.target.value})
                                    }}
                                    id="replycontent"/>
                              </div>
                          </div>

                      </div>

                  </fieldset>

                  <div>
                      <p className="submit inline-edit-save">
                          <button type="button"
                                  onClick={this.props.onEditSingleCancelClick}
                                  className="button-secondary cancel alignleft">
                              Cancel
                          </button>
                          <input type="submit"
                                 name="bulk_edit"
                                 id="bulk_edit"
                                 className="button button-primary orangeSolidColor_B-2gO alignright"
                                 onClick={this.onBulkUpdateSubmitClick.bind(this)}
                                 value="Update Comment"/>
                      </p>
                  </div>


              </td>
          </tr>
        )
    }
}

AppAdminCommentsEditSingle.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCommentsEditSingle.displayName = "AppAdminCommentsEditSingle";

module.exports = withRouter(AppAdminCommentsEditSingle);
export default withRouter(AppAdminCommentsEditSingle);
