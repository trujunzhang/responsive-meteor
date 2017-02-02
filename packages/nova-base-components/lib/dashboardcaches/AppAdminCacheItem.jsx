import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import PoliticlCaches from "meteor/nova:politicl-caches";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminCacheItem extends Component {
    onTopicsClick(topic) {
        this.context.messages.appManagement.appendQuery(this.props.router, "topic", topic);
    }

    onCategoryClick(category) {
        this.context.messages.appManagement.appendQuery(this.props.router, "category", category);
    }

    onDomainClick(domain) {
        this.context.messages.appManagement.appendQuery(this.props.router, "domain", domain);
    }

    onCuratorClick(curator) {
        this.context.messages.appManagement.appendQuery(this.props.router, "curator", curator);
    }

    checkIt() {
        this.props.checkRow(this.props.post._id, !this.props.checked);
    }

    render() {
        const {cache} = this.props;
        const updatedAt = moment(cache.created_at).format("YYYY/MM/DD");
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
              <td className="author column-author">
                  <a onClick={this.onDomainClick.bind(this, cache.url_from)}>{cache.url_from}</a>
              </td>
              <td className="topics column-topics">
                  {cache.url}
              </td>
              <td className="date column-date">Last Modified<br/>
                  <abbr title={updatedAt}>{updatedAt}</abbr>
              </td>
          </tr>
        )
    }

}

AppAdminCacheItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminCacheItem.displayName = "AppAdminCacheItem";

module.exports = withRouter(AppAdminCacheItem);
export default withRouter(AppAdminCacheItem);
