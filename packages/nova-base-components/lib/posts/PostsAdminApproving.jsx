import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

class PostsAdminApproving extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            isSubmitting: false
        };
    }

    onApprovePostClick(status) {
        if (this.state.isSubmitting) {
            return;
        }
        const {post} = this.props;
        this.setState({isSubmitting: true});
        let self = this;
        this.context.actions.call('posts.approving.status', post._id, status, (error, result) => {
            self.setState({isSubmitting: false});
            if (!!error) {
                self.context.messages.flash("Approve the post's status failure", "error")
            }
        });
    }

    render() {
        const {isSubmitting} = this.state;
        let nextEnable = !isSubmitting;
        return (
          <div className="relatedPosts_3XCIU" rel="related-posts">
              <h2 className="heading_woLg1 heading_AsD8K title_2vHSk subtle_1BWOT base_3CbW2">
                  {"Status: (" + Posts.getPostStatusTitle(this.props.post.status) + ")"}
              </h2>
              <div className="inline-edit-group wp-clearfix">
                  <div className="inline-edit-status">
                      <button
                        onClick={this.onApprovePostClick.bind(this, Posts.config.STATUS_APPROVED)}
                        className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d podcastsSolidColor_2N0RG solidletiant_2wWrf posts_admin_approving_width80"
                        disabled={!nextEnable}
                        type="submit">
                          <div className="buttonContainer_wTYxi article_button">PUBLISH</div>
                      </button>
                  </div>
                  <div className="row">
                      <div className="inline-edit-status posts_admin_approving_margin_top12">
                          <button
                            onClick={this.onApprovePostClick.bind(this, Posts.config.STATUS_DELETED)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d deleteSolidColor_B-2gO solidletiant_2wWrf posts_admin_approving_margin_right2"
                            disabled={!nextEnable}
                            type="submit">
                              <div className="buttonContainer_wTYxi article_button">DELETE</div>
                          </button>
                          <button
                            onClick={this.onApprovePostClick.bind(this, Posts.config.STATUS_SPAM)}
                            className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d booksSolidColor_101bu solidletiant_2wWrf"
                            disabled={!nextEnable}
                            type="submit">
                              <div className="buttonContainer_wTYxi article_button">SAVE AS DRAFT</div>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

PostsAdminApproving.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

PostsAdminApproving.displayName = "PostsAdminApproving";

module.exports = withRouter(PostsAdminApproving);
export default withRouter(PostsAdminApproving);
 
