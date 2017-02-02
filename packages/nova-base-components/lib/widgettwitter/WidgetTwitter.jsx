import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

class WidgetTwitter extends Component {

    render() {
        const twitterHeight = 650;
        return (
          <div className="paddedBox_2UY-S box_c4OJj sidebarBox_1-7Yk twitterTimeline_FOpmS">
              <div className="content_DcBqe" style={{height: twitterHeight}}>
                  <Telescope.components.TwitterTimeline user="GetPoliticl" limit={5} height={twitterHeight}/>
              </div>
          </div>
        )
    }

}

WidgetTwitter.displayName = "WidgetTwitter";

module.exports = WidgetTwitter;
