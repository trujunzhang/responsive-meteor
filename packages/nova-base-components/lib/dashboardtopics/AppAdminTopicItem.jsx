import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import Topics from "meteor/nova:topics";
import moment from 'moment';
import {withRouter} from 'react-router';

class AppAdminTopicItem extends Component {

    onTopicCountClick() {
        const topic = this.props.topic;
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {admin: true, topicId: topic._id}}, topic.name);
    }

    checkIt() {
        this.props.callback(this.props.index, !this.props.checked);
    }

    renderRowTypeName() {
        const topic = this.props.topic;
        let typeString = "";
        if (topic.status == Topics.config.STATUS_DELETED) {
            //typeString += "-trash";
        }
        if (topic.is_ignore == true) {
            typeString += "-filter";
        }
        return (
          <span>{topic.name + " " + typeString}</span>
        )
    }

    render() {
        const topic = this.props.topic;
        const counterKeyName = Topics.getCounterKeyName();
        const count = topic[counterKeyName] ? topic[counterKeyName] : '-';

        const topicStatus = Topics.getTopicStatus(topic, !!this.props.router.location.query.status ? this.props.router.location.query.status : "all");

        return (
          <tr key={topic._id}
              className="iedit author-other level-0 post-64943 type-post status-draft format-standard has-post-thumbnail hentry category-all-reads tag-article-208 tag-cauvery-basin tag-cauvery-dispute tag-cauvery-water-disputes-tribunal tag-dipak-misra tag-houses-of-legislature tag-inter-state-river-water-disputes-act tag-karnataka tag-rules-of-procedure tag-supreme-court tag-tamil-nadu tag-uday-umesh-lalit">
              <th scope="row" className="check-column">
                  <label className="screen-reader-text">{"Select " + topic.name}</label>
                  <input
                    id="cb-select"
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.checkIt.bind(this)}/>
                  <div className="locked-indicator"></div>
              </th>
              <td className="curator column-name">
                  <strong>
                      <a className="row-title">{topic.name}</a>
                      {topicStatus.length == 0 ? null : " — " }
                      {
                          (topicStatus.length == 0 ? null :
                              (topicStatus.map((status, index) =>
                                  <span key={index} className="post-state">{status + (index < topicStatus.length - 1 ? ", " : "")}</span>
                                )
                              )
                          )
                      }
                  </strong>
                  <Telescope.components.AppAdminTopicItemAction actionEvent={this.props.actionEvent} topic={topic}/>
              </td>
              <td className="curator column-slug">
                  <span>{topic.slug}</span>
              </td>
              <td className="curator column-count">
                  <a onClick={this.onTopicCountClick.bind(this)}>{count}</a>
              </td>

          </tr>
        )
    }

}

AppAdminTopicItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminTopicItem.displayName = "AppAdminTopicItem";

module.exports = withRouter(AppAdminTopicItem);
export default withRouter(AppAdminTopicItem);
