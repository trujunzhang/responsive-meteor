import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';


class AppAdminUsersAction extends Component {

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
        var value = event.target.value;
        this.setState({actionType: value});
    }

    onActionApplyClick() {
        switch (this.state.actionType) {
            case "trash":

                break;
            case "filter":

                break;
            case "restore":

                break;
            case "delete":

                break;
        }
    }

    renderRowActionForTrash() {
        return (
          <div className="alignleft actions bulkactions">
              <label className="screen-reader-text">Select bulk action</label>
              <select name="action" id="bulk-action-selector-top" value={this.state.actionType} onChange={this.onActionTypeChange}>
                  <option value="action">Bulk Actions</option>
                  <option value="restore">Restore</option>
                  <option value="delete">Delete Permanently</option>
              </select>
              <input type="submit" id="doaction" className="button action" value="Apply" onClick={this.onActionApplyClick}/>
          </div>
        )
    }

    renderRowAction() {
        return (
          <div className="alignleft actions bulkactions">
              <label className="screen-reader-text">Select bulk action</label>
              <select name="action" id="bulk-action-selector-top" value={this.state.actionType} onChange={this.onActionTypeChange}>
                  <option value="action">Bulk Actions</option>
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
        const status = this.props.location.query.status;

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

AppAdminUsersAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminUsersAction.displayName = "AppAdminUsersAction";

module.exports = withRouter(AppAdminUsersAction);
export default withRouter(AppAdminUsersAction);
