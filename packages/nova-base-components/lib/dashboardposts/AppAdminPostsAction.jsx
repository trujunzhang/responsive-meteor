import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class AppAdminPostsAction extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            // batch action
            actionType: "action",
        };

        this.onActionTypeChange = this.onActionTypeChange.bind(this);
        this.onActionApplyClick = this.onActionApplyClick.bind(this);
    }

    onActionTypeChange(event) {
        this.setState({actionType: event.target.value});
    }

    onActionApplyClick() {
        let self = this;
        this.props.actionEvent(this.state.actionType, function (error, result) {
            self.setState({actionType: "action"});
        });
    }

    renderRowAction() {
        return (
          <div className="alignleft actions bulkactions">
              <label className="screen-reader-text">Select bulk action</label>
              <select name="action"
                      id="bulk-action-selector-top"
                      value={this.state.actionType}
                      onChange={this.onActionTypeChange}>
                  <option value="action">Bulk Actions</option>
                  <option value="bulk-edit" className="hide-if-no-js">Edit</option>
                  <option value="trash">Move to Trash</option>
              </select>
              <input type="submit" id="doaction" className="button action" value="Apply" onClick={this.onActionApplyClick}/>
          </div>
        )
    }

    renderRowActionForTrash() {
        return (
          <div className="alignleft actions bulkactions">
              <label className="screen-reader-text">Select bulk action</label>
              <select name="action"
                      id="bulk-action-selector-top"
                      value={this.state.actionType}
                      onChange={this.onActionTypeChange}>
                  <option value="action">Bulk Actions</option>
                  <option value="restore">Restore</option>
                  <option value="delete_permanently">Delete Permanently</option>
              </select>
              <input type="submit"
                     id="doaction"
                     className="button action"
                     value="Apply"
                     onClick={this.onActionApplyClick}/>
          </div>
        )
    }

    render() {
        const {status} = this.props.location.query;

        switch (status) {
            case "trash":
                return (
                  <div>{this.renderRowActionForTrash()}</div>
                );
            default:
                return (
                  <div>{this.renderRowAction()}</div>
                )
        }

    }

}

AppAdminPostsAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminPostsAction.displayName = "AppAdminPostsAction";

module.exports = withRouter(AppAdminPostsAction);
export default withRouter(AppAdminPostsAction);
