import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import Topics from "meteor/nova:topics";
import moment from 'moment';
import {withRouter} from 'react-router';

/**
 * Make day wise groups on category pages, remove calendar widget from tag and source pages
 * So calendar will only show on “Homepage” and “Category” page
 * Homepage and category pages will have day wise groups
 */
class AppSideBar extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * A: Make day wise groups on category pages, remove calendar widget from tag and source pages
     *    So calendar will only show on “Homepage” and “Category” page
     *
     * @returns {XML}
     */
    renderWidgetCalendar() {
        return (
          <Telescope.components.WidgetCalendar selected={moment().startOf("day")}/>
        )
    }

    renderProduction() {
        return (
          <div>
              <Telescope.components.WidgetTwitter />
          </div>
        )
    }

    /**
     * Remove Download App image from sidebar
     * Sidebar widgets location -
     * 1. Trending Topics on top,
     * 2. then calendar,
     * 3. The follow us on social media,
     * 4.twitter stream and footer links
     * @returns {XML}
     */
    render() {
        return (
          <div className="sidebar_Y2LGQ">

              {this.renderWidgetCalendar()}

              <Telescope.components.WidgetAppFollower/>
              <Telescope.components.WidgetAppFooter />
          </div>
        )
    }

}

AppSideBar.contextTypes = {
    messages: React.PropTypes.object
};

AppSideBar.displayName = "AppSideBar";

module.exports = withRouter(AppSideBar);
export default withRouter(AppSideBar);
