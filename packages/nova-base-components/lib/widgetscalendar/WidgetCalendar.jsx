import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';
import Posts from "meteor/nova:posts";
import moment from 'moment';

class WidgetCalendar extends Component {

    constructor(props) {
        super(props);

        let selected = this.props.selected.clone();
        const before = props.router.location.query.before;
        if (!!before) {
            selected = moment(before);
        }
        this.state = this.initialState = {
            month: _.clone(selected)
        };
    }

    previousYear() {
        let month = this.state.month;
        month.add(-1, "Y");
        this.setState({month: month});
    }

    nextYear() {
        let month = this.state.month;
        month.add(1, "Y");
        this.setState({month: month});
    }

    previousMonth() {
        let month = this.state.month;
        month.add(-1, "M");
        this.setState({month: month});
    }

    nextMonth() {
        let month = this.state.month;
        month.add(1, "M");
        this.setState({month: month});
    }

    select(day) {
        this.setState({month: day.date});
        const dateString = Posts.getDateQueryString(day.date);

        this.context.messages.pushNewLocationPathWithDelay(this.props.router, {pathname: "/", query: {after: dateString, before: dateString}});
    }

    /**
     * A: Remove year changing arrows and change text to “Oct 16” short form
     * @returns {XML}
     */
    renderHeader() {
        const year = this.state.month.format("YY");
        const month = this.state.month.format("MMMM");

        return (
          <div className="calendar-header-container">
              <a className="rc-calendar-prev-month-btn" role="button" title="Previous month (PageUp)"
                 onClick={this.previousMonth.bind(this)}>‹</a>
              <span className="rc-calendar-my-select">
                    <a className="rc-calendar-month-select" role="button" title="Choose a month">{month}</a>
                    <a className="rc-calendar-year-select" role="button" title="Choose a month">{" '" + year}</a>
                </span>
              <a className="rc-calendar-next-month-btn" title="Next month (PageDown)"
                 onClick={this.nextMonth.bind(this)}>›</a>
          </div>
        )
    }

    renderDayNames() {
        const daysNames = [
            {title: "Sunday", value: "Su"},
            {title: "Monday", value: "Mo"},
            {title: "Tuesday", value: "Tu"},
            {title: "Wednesday", value: "We"},
            {title: "Thursday", value: "Th"},
            {title: "Friday", value: "Fr"},
            {title: "Saturday", value: "Sa"},
        ];
        return (
          <tr role="row">
              {daysNames.map((item, key) => {
                  return (
                    <th role="columnheader" title={item.title} className="rc-calendar-column-header" key={item.value}>
                        <span className="rc-calendar-column-header-inner">{item.value}</span>
                    </th>
                  )
              })}
          </tr>
        )
    }

    render() {
        return (
          <div className="paddedBox_2UY-S box_c4OJj sidebarBox_1-7Yk sidebarBoxPadding_y0KxM">
              <div className="content_DcBqe">
                  <div className="rc-calendar">
                      <div className="rc-calendar-date-panel">
                          <div className="rc-calendar-header">
                              {this.renderHeader()}
                          </div>
                          <div className="rc-calendar-calendar-body">
                              <table className="rc-calendar-table" role="grid">
                                  <thead >
                                  {this.renderDayNames()}
                                  </thead>
                                  <tbody className="rc-calendartbody">
                                  {this.renderWeeks()}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }

    renderWeeks() {
        let weeks = [],
          done = false,
          date = this.state.month.clone().startOf("month").add("w" - 1).day("Sunday"),
          monthIndex = date.month(),
          count = 0;

        while (!done) {
            weeks.push(<Telescope.components.Week key={date.toString()} date={date.clone()} month={this.state.month}
                                                  select={this.select.bind(this)} selected={this.state.month}/>);
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }

        return weeks;
    }

    renderMonthLabel() {
        return (
          <span>{this.state.month.format("MMMM, YYYY")}</span>
        )
    }
}

WidgetCalendar.contextTypes = {
    messages: React.PropTypes.object
};

WidgetCalendar.displayName = "WidgetCalendar";

module.exports = withRouter(WidgetCalendar);
export default withRouter(WidgetCalendar);
