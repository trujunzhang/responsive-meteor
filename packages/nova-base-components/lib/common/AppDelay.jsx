import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import Topics from "meteor/nova:topics";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppDelay extends Component {

    render() {
        const loadMoreMessage = "All good things take time";
        return (
          <Telescope.components.PostsLoading message={loadMoreMessage}/>
        )
    }

}

AppDelay.contextTypes = {
    messages: React.PropTypes.object
};

AppDelay.displayName = "AppDelay";

module.exports = AppDelay;
export default AppDelay;
