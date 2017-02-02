import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {withRouter} from 'react-router';
import {Dropdown, Button} from 'react-bootstrap';

class PostsTopics extends Component {

    render() {
        let topicsArray = this.props.post.topicsArray ? this.props.post.topicsArray : [];

        return (
          <div className="topics_39_B0" rel="topics-list">
              {topicsArray.map((topic, index) =>

                  <div key={topic._id}
                       className="topicWrap_2Uvaj"
                       rel="topic-item"
                       onClick={this.props.callBack.bind(this, topic)}>
                      <span>
                          <a
                              className="button_2I1re smallSize_1da-r secondaryText_PM80d greySolidColor_270pZ solidVariant_2wWrf"
                              title={topic.name}>
                              <div className="buttonContainer_wTYxi">{topic.name}</div>
                          </a>    
                      </span>
                </div>
              )}
          </div>
        )
    }

    renderxxx() {
        let topicsArray = this.props.post.topicsArray ? this.props.post.topicsArray : [];

        return (
          <div className="tags tags--postTags tags--light">

              {topicsArray.map((topic, index) =>
                  <a key={index}
                     className="link u-baseColor--link"
                     onClick={this.props.callBack.bind(this, topic)}>{topic.name}
                  </a>
              )}

          </div>
        )
    }
}

PostsTopics.displayName = "PostsTopics";

module.exports = withRouter(PostsTopics);
export default withRouter(PostsTopics);
