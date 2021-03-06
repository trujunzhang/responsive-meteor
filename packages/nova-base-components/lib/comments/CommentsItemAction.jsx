import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {intlShape, FormattedRelative} from 'react-intl';
import Users from 'meteor/nova:users';
import Posts from 'meteor/nova:posts';

class CommentsItemAction extends Component {

    renderTwitterIcon(){
        const {comment} = this.props;
        return(
 <a
                href = {Posts.generateCommentTwitterShareLink(comment)}
                target="_blank"
                className="tweet_3a9pw action_Hv6P3 secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2"
                rel="share-on-twitter">
                  <span>
                    <span>
                      <svg width="16px" height="13px" viewBox="0 0 16 13">
                        <path
                          d="M15.999,1.5367041 C15.4105184,1.79765391 14.7775382,1.97411998 14.1135589,2.05360469 C14.7910377,1.64718285 15.3115215,1.00430648 15.5570138,0.237953855 C14.9225336,0.613881561 14.2200556,0.887328975 13.472579,1.03430071 C12.8735977,0.39642338 12.0206243,-0.002 11.0766538,-0.002 C9.26371048,-0.002 7.7942564,1.46721746 7.7942564,3.27986887 C7.7942564,3.53731936 7.82325549,3.7877712 7.87925374,4.02772505 C5.15133899,3.89075139 2.73241458,2.58400269 1.11346517,0.598384541 C0.830974001,1.08329129 0.668979063,1.64668295 0.668979063,2.2485672 C0.668979063,3.3873482 1.24846095,4.39165507 2.12943342,4.98054182 C1.59145024,4.96354509 1.08546605,4.81607345 0.642479891,4.57012075 C0.641979907,4.58361815 0.641979907,4.59761546 0.641979907,4.61161277 C0.641979907,6.20180696 1.77344455,7.52805191 3.27489763,7.82949394 C2.99940624,7.90447952 2.7094153,7.94447183 2.40992466,7.94447183 C2.19843127,7.94447183 1.99293769,7.92397577 1.79244395,7.88548318 C2.20993091,9.18923246 3.42239302,10.13805 4.85884813,10.1645449 C3.73538324,11.0448756 2.31992747,11.5692748 0.781975532,11.5692748 C0.516983813,11.5692748 0.255991969,11.5537777 -0.001,11.5232836 C1.45145461,12.4546045 3.17690069,12.998 5.03084275,12.998 C11.0686541,12.998 14.3700509,7.99696174 14.3700509,3.65979581 C14.3700509,3.51732321 14.367051,3.37585041 14.3605512,3.23537743 C15.0020312,2.77246645 15.5585138,2.19457758 15.9985,1.5367041 L15.999,1.5367041 Z"
                          id="twitter" fill="#000000"/>
                      </svg>
                    </span>
                    <span className="shareLabel_2yYck">tweet</span>
                  </span>
              </a>
        )
    }

    renderFacebookIcon(){
        const {comment} = this.props;
        return(
           <a
                className="facebook_1qw8K action_Hv6P3 secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2"
                href = {Posts.generateCommentFacebookShareLink(comment)}
                target="_blank"
                rel="share-on-facebook">
                  <span>
                    <span>
                      <svg width="8" height="13" viewBox="0 0 8 14">
                        <path d="M7.2 2.323H5.923c-1.046 0-1.278.464-1.278 1.16V5.11h2.44l-.35 2.438h-2.09v6.387H2.09V7.548H0V5.11h2.09V3.252C2.09 1.162 3.368 0 5.342 0c.93 0 1.742.116 1.858.116v2.207z" fill="#FFF"/>
                      </svg>
                    </span>
                    <span className="shareLabel_2yYck">share</span>
                  </span>
              </a>
        )
    }


    renderEditIcon(){
        const {comment,showEdit} = this.props;
        return(
              <Telescope.components.CanDo action="comments.edit" document={comment}>
                  <a className="secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2" onClick={showEdit}>
                      <span className="icon_2W98y">
                          <svg width="8" height="8" viewBox="0 0 8 8">
                              <path
                                d="M4.05,1.75 L0.15,5.65 C0.05,5.75 0,5.85 0,6 L0,7.5 C0,7.8 0.2,8 0.5,8 L2,8 C2.15,8 2.25,7.95 2.35,7.85 L6.25,3.95 L4.05,1.75 Z M7.85,1.65 L6.35,0.15 C6.15,-0.05 5.85,-0.05 5.65,0.15 L4.75,1.05 L6.95,3.25 L7.85,2.35 C8.05,2.15 8.05,1.85 7.85,1.65 Z" fill="#999">
                              </path>
                          </svg>
                      </span>
                      edit
                  </a>
              </Telescope.components.CanDo>
        )
    }

    render() {
        const {comment,showReply} = this.props;

        return (
          <div className="actions_3oz6g">
              {/*replay*/}
              <a className="upvote_3Nd3Q action_Hv6P3 secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2"
                 onClick={showReply}>
                  <span>
                  <Telescope.components.Icon name="reply"/>
                  </span>
                  <span className="noVotesLabel_1gl1X">reply</span>
              </a>

              {/*article's upvote/downvote button*/}
              <Telescope.components.CommentUpvote comment={comment}/>
              <Telescope.components.CommentDownvote comment={comment}/>
              {/*twitter*/}
              {this.renderTwitterIcon()} 
              {/*share*/}
              {this.renderFacebookIcon()} 
              {/*edit */}
              {this.renderEditIcon()}
              {/*posted at*/}
              <a
                className="timestamp_28Wws secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">
                  <time title={comment.postedAt}>
                      <FormattedRelative value={comment.postedAt}/>
                  </time>
              </a>
          </div>
        )
    }

}

CommentsItemAction.propTypes = {
    comment: React.PropTypes.object.isRequired, // the current comment
    currentUser: React.PropTypes.object, // the current user
};

CommentsItemAction.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    messages: React.PropTypes.object,
    events: React.PropTypes.object,
    intl: intlShape
};

CommentsItemAction.displayName = "CommentsItemAction";

module.exports = CommentsItemAction;
export default CommentsItemAction;


