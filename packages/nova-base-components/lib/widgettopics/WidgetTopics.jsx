import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {withRouter} from 'react-router';
import Topics from "meteor/nova:topics";

class WidgetTopics extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {};
    }

    onTagClick(topic) {
        // ** Trending Topics **
        //  (Point 4 Explanation):
        //    When a person clicks tag “Demonitisation” Link: http://scruby.site/?title=Demonetisation&topicId=a387097638dc4b5946f357176a0f33a7
        //    It should open search query “Demonitisation” Link: http://scruby.site/?query=Demonitisation
        //    Because we will not be able to add “Demonitisation” tag in every articles, but all articles will have the word “Demonitisation”.

        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {topicId: topic._id}}, topic.name);
    }

    render() {
        const {results, ready} = this.props;
        if (ready && !!results.length) {
            return (
              <div className="paddedBox_2UY-S box_c4OJj sidebarBox_1-7Yk sidebarBoxPadding_y0KxM">
                  <div className="content_DcBqe">

                      <Telescope.components.WidgetHeader message="TRENDING"/>

                      <div className="tags tags--postTags tags--light">
                          {results.map((item, key) => {
                              return (
                                <a key={item._id}
                                   className="link u-baseColor--link"
                                   onClick={this.onTagClick.bind(this, item)}>
                                    {Topics.getTopicsTitle(item.name)}
                                </a>
                              )
                          })}
                      </div>
                  </div>
              </div>
            )
        }

        return (
          <div></div>
        )
    }
}

WidgetTopics.contextTypes = {
    messages: React.PropTypes.object
};

WidgetTopics.displayName = "WidgetTopics";

module.exports = withRouter(WidgetTopics);
export default withRouter(WidgetTopics);
