import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import PoliticlHistory from "meteor/nova:politicl-history";
import Users from 'meteor/nova:users';
import moment from 'moment';
import {withRouter} from 'react-router';


class AppAdminHistoryItem extends Component {

    onScrapedPostClick() {
        const {history} = this.props;
        const post = history.post;
        if (!!post) {
            Users.openNewWindow("/", {postId: post._id, title: post.slug});
        }
    }

    checkIt() {
        this.props.checkRow(this.props.post._id, !this.props.checked);
    }

    render() {
        const {history} = this.props;
        const post = history.post;
        const updatedAt = moment(history.created_at).format("YYYY/MM/DD");
        return (
          <tr
            className="iedit author-other level-0 post-64943 type-post status-draft format-standard has-post-thumbnail hentry category-all-reads tag-article-208 tag-cauvery-basin tag-cauvery-dispute tag-cauvery-water-disputes-tribunal tag-dipak-misra tag-houses-of-legislature tag-inter-state-river-water-disputes-act tag-karnataka tag-rules-of-procedure tag-supreme-court tag-tamil-nadu tag-uday-umesh-lalit">
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select "}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              {/*<td className="title column-title has-row-actions column-primary page-title">*/}
              {/*<strong>*/}
              {/*<a className="row-title">{"-"}</a>*/}
              {/*</strong>*/}
              {/*</td>*/}
              <td className="topics column-topics">
                  {history.url}
              </td>
              <td className="count column-post-count">
                  <a onClick={this.onScrapedPostClick.bind(this)}>{!!post ? '1' : '-'}</a>
              </td>
              <td className="date column-date">Last Modified<br/>
                  <abbr title={updatedAt}>{updatedAt}</abbr>
              </td>
          </tr>
        )
    }

}

AppAdminHistoryItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminHistoryItem.displayName = "AppAdminHistoryItem";

module.exports = withRouter(AppAdminHistoryItem);
export default withRouter(AppAdminHistoryItem);
