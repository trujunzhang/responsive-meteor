import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

let numeral = require('numeral');

class AppAdminTopicsAction extends Component {

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
        let value = event.target.value;
        this.setState({actionType: value});
    }

    onActionApplyClick() {
        let self = this;
        this.props.actionEvent(this.state.actionType, function (error, result) {
            self.setState({actionType: "action"});
        });
        //const topicIds = this.props.getCheckedTopicIds();
        //switch (this.state.actionType) {
        //
        //    case "trash":
        //        this.context.actions.call('topics.move.to.trash', topicIds, (error, result) => {
        //            this.setState({actionType: "action"});
        //        });
        //        break;
        //    case "filter":
        //        this.context.actions.call('topics.filter.in.trending', topicIds, (error, result) => {
        //            this.setState({actionType: "action"});
        //        });
        //        break;
        //    case "restore":
        //        this.context.actions.call('topics.move.to.approved', topicIds, (error, result) => {
        //            this.setState({actionType: "action"});
        //        });
        //        break;
        //    case "delete":
        //        this.context.actions.call('topics.delete', topicIds, (error, result) => {
        //            this.setState({actionType: "action"});
        //        });
        //        break;
        //}
    }

    renderRowActionForFilter() {
        return (
          <div className="alignleft actions bulkactions">
              <label className="screen-reader-text">Select bulk action</label>
              <select name="action" id="bulk-action-selector-top" value={this.state.actionType} onChange={this.onActionTypeChange}>
                  <option value="action">Bulk Actions</option>
                  <option value="filter_restore">Restore</option>
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
                  <option value="trash">Move to Trash</option>
                  <option value="filter">Filter in Trending</option>
              </select>
              <input type="submit" id="doaction" className="button action" value="Apply" onClick={this.onActionApplyClick}/>
          </div>
        )
    }

    render() {
        const status = this.props.location.query.status;

        switch (status) {
            case "filter":
                return (
                  <div>{this.renderRowActionForFilter()}</div>
                );
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

AppAdminTopicsAction.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminTopicsAction.displayName = "AppAdminTopicsAction";

module.exports = withRouter(AppAdminTopicsAction);
export default withRouter(AppAdminTopicsAction);
