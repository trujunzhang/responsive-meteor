import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router';

class PostsItemEditActions extends Component {
    // A: Title + Image should open the “Read More” link - link to the original article
    // B: Title + Image in post list is like in post detail. click them will open original url?
    // A: YES

    render() {
        const {post} = this.props;
        return (
          <div className="postActivities_2pvSp">
              <a className="avatar_2lxdG">
                  <Telescope.components.UsersBlurryImageAvatar
                    avatarObj={Users.getAvatarObj(this.context.currentUser)}
                    size={20}/>
              </a>
              <div className="body_3co4i">
                  {post.categoriesArray ? <Telescope.components.PostsCategories post={post}/> : ""}

                  <a className="button_2I1re smallSize_1da-r secondaryText_PM80d subtleVariant_tlhj3 simpleVariant_1Nl54 button_2n20W"
                     label="edit"
                     onClick={this.onEditPostClick.bind(this)}>
                      <div className="buttonContainer_wTYxi">
                            <span className="post-item-event-button">
                                Edit
                            </span>
                      </div>
                  </a>
              </div>
          </div>
        )
    }

    onEditPostClick(event) {
        event.preventDefault();
        const {messages, currentUser} = this.context,
          {post, router} = this.props,
          admin = messages.appManagement.getAdmin(router.location, currentUser);
        if (admin) {
            // Dashboard UI(for admin)
            // When admin clicks on Edit, the submitted article should open in a new window, not the same window.
            Users.openNewWindow("/", {action: "edit", editId: post._id, admin: true});
        } else {
            messages.pushRouter(router, {pathname: "/", query: {action: "edit", editId: post._id}});
        }

        event.stopPropagation();
    }

}

PostsItemEditActions.propTypes = {
    post: React.PropTypes.object.isRequired
};

PostsItemEditActions.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(PostsItemEditActions);
export default withRouter(PostsItemEditActions);
 
