import React, {PropTypes, Component} from 'react';
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

class FoldersItem extends Component {

    onFolderItemClick() {
        const {folder, user} = this.props,
          linkObject = Users.getLinkObject('folderitem', user, folder);

        this.context.messages.pushRouter(this.props.router, linkObject);
    }

    render() {
        const {folder} = this.props;
        const visible = folder.visible;
        let postsCount = folder.posts.length;
        return (
          <div className="backgroundImage_1hK9M card_2nuIG card_3kZOV">
              <a className="link_1QbEt" onClick={this.onFolderItemClick.bind(this)}>
                  <span className="name_3GvIR featured_2W7jd inverse_1CN6F base_3CbW2">{folder.name}</span>
                  {visible == "Lock" ? <span className="collections-popover--collection--icon v-collect folder-visible-for-title fa fa-lock"/> : null}
              </a>
              <button
                onClick={this.onFolderItemClick.bind(this)}
                className="button_2I1re smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 follow_3OEqn">
                  <div className="buttonContainer_wTYxi">{postsCount + " posts"}</div>
              </button>
          </div>
        )
    }
}

FoldersItem.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(FoldersItem);
export default withRouter(FoldersItem);
