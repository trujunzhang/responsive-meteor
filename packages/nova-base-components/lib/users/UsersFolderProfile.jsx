import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';
import Folders from "meteor/nova:folders";

class UsersFolderProfile extends Component {
    constructor(props) {
        super(props);

        const {folder} = this.props;
        const cachedIds = !!folder ? folder.posts : [];

        this.state = this.initialState = {
            cachedIds: cachedIds
        };
    }

    onBackToCollectionClick() {
        const {folder} = this.props,
          user = folder.folderUser,
          path = "/users/" + user.telescope.slug + "/collections";
        this.context.messages.pushRouter(this.props.router, {pathname: path});
    }

    renderPostSingle() {
        const {location} = this.props;
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <Telescope.components.PostsSingle params={{"slug": location.query.title, "_id": location.query.postId}}/>
          </div>
        )
    }

    renderFolderProfile() {
        const {folder} = this.props;
        let user = folder.folderUser;

        const {cachedIds} = this.state;

        const terms = {view: 'new', postsType: 'user.posts', cachedIds: cachedIds, listId: "user.folder.posts.list", limit: 5};
        const {selector, options} = Posts.parameters.get(terms);

        return (
          <div className="collection-detail">
              {/*header section*/}
              <Telescope.components.UserFolderProfileHeader
                user={user}
                folder={folder}
                callBack={this.onBackToCollectionClick.bind(this)}/>
              <div className="container">
                  <div className="constraintWidth_ZyYbM">
                      {/*back button section*/}
                      <Telescope.components.UserFolderProfileBackButtonSection
                        user={user}
                        callBack={this.onBackToCollectionClick.bind(this)}/>
                      <Telescope.components.NewsListContainer
                        collection={Posts}
                        publication="posts.list"
                        selector={selector}
                        options={options}
                        terms={terms}
                        joins={Posts.getJoins()}
                        component={Telescope.components.FolderPostsList}
                        componentProps={
                            {
                                folder: folder
                            }
                        }
                        listId={"user.folder.posts.list"}
                        limit={terms.limit}
                      />
                  </div>
              </div>
          </div>
        )
    }

    render() {
        const {location} = this.props;
        const isShowPopoverPosts = this.context.messages.isShowPopoverPosts();
        // Refresh the page, show the single post detail page.
        if (!isShowPopoverPosts && !!location.query && !!location.query.postId) {
            return this.renderPostSingle()
        }

        return this.renderFolderProfile();
    }

}

UsersFolderProfile.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

UsersFolderProfile.displayName = "UsersFolderProfile";

module.exports = withRouter(UsersFolderProfile);
export default withRouter(UsersFolderProfile);

