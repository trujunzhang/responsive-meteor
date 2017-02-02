import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminFlagItem extends Component {

    checkIt() {
        this.props.checkRow(this.props.post._id, !this.props.checked);
    }

    render() {
        const {flag, router} = this.props,
          {post, flager, author, reason, postedAt} = flag,
          avatarObjAuthor = Users.getAvatarObj(author),
          displayNameAuthor = Users.getDisplayName(author),
          emailAuthor = Users.getUserEmail(author),
          avatarObjFlager = Users.getAvatarObj(flager),
          displayNameFlager = Users.getDisplayName(flager),
          emailFlager = Users.getUserEmail(flager),
          updatedAt = moment(postedAt).format("YYYY/MM/DD at hh:mm");

        return (
          <tr
            className="iedit author-other level-0 post-64943 type-post status-draft format-standard has-post-thumbnail hentry category-all-reads tag-article-208 tag-cauvery-basin tag-cauvery-dispute tag-cauvery-water-disputes-tribunal tag-dipak-misra tag-houses-of-legislature tag-inter-state-river-water-disputes-act tag-karnataka tag-rules-of-procedure tag-supreme-court tag-tamil-nadu tag-uday-umesh-lalit">
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select " + post.title}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              <td className="title column-title has-row-actions column-primary page-title">
                  <a
                    onClick={(e) => {
                        e.preventDefault();
                        Users.openNewWindow("/", {admin: true, postId: post._id, title: post.slug});
                    }}
                  >
                      {post.title}
                  </a>
                  <Telescope.components.AppAdminFlagItemAction actionEvent={this.props.actionEvent} flag={flag}/>
              </td>
              <td className="author column-author">
                  <strong>
                      <img alt=""
                           src={avatarObjAuthor.url}
                           className="avatar avatar-32 photo"
                           height="32" width="32"/>
                      {!!displayNameAuthor ? displayNameAuthor : "-" }
                  </strong>
                  <br/>
                  <Telescope.components.MailTo email={emailAuthor}/>
              </td>
              <td className="comment column-reason has-row-actions column-primary">
                  <div >{reason}</div>
              </td>
              <td className="flager column-flager">
                  <strong>
                      <img alt=""
                           src={avatarObjFlager.url}
                           className="avatar avatar-32 photo"
                           height="32" width="32"/>
                      {!!displayNameFlager ? displayNameFlager : "-" }
                  </strong>
                  <br/>
                  <Telescope.components.MailTo email={emailFlager}/>
              </td>
              <td className="date column-date">
                  <div className="submitted-on">
                      <a >
                          {updatedAt}
                      </a>
                  </div>
              </td>
          </tr>
        )
    }

}

AppAdminFlagItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminFlagItem.displayName = "AppAdminFlagItem";

module.exports = withRouter(AppAdminFlagItem);
export default withRouter(AppAdminFlagItem);
