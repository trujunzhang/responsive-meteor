import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {withRouter} from 'react-router';

import {ModalTrigger} from "meteor/nova:core";

class PostsNoResults extends Component {

    onSubmitOneClick() {
        const {currentUser} = this.context;

        if (!currentUser) {
            this.context.messages.showLoginUI();

        } else {
            this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {action: "new"}});
        }
    }

    render() {
        let noMessageHint = "No links yet.";

        const {location, relatedList} = this.props;
        if (!relatedList && !!location.query.query) {
            noMessageHint = "We didn’t find anything with that search term.";
        }
        return (
          <div className="posts-no-results">
              <div className="posts-no-results-left">{noMessageHint + " Why not"}</div>
              <a onClick={this.onSubmitOneClick.bind(this)}>submit one</a>
              <div >?</div>
          </div>
        )
    }
}

PostsNoResults.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

PostsNoResults.displayName = "PostsNoResults";

module.exports = withRouter(PostsNoResults);
export default withRouter(PostsNoResults);
