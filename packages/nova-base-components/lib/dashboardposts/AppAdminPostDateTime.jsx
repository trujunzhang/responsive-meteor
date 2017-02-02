import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import moment from 'moment';

class AppAdminPostDateTime extends Component {

    constructor(props) {
        super(props);

        let postedAt = this.props.postedAt;
        let moment2 = moment(postedAt);
        let format = moment2.format("YYYY-MM-DD-HH-mm-ss").split('-');
        this.state = this.initialState = {
            year: format[0],
            month: format[1],
            day: format[2],
            hour: format[3],
            minute: format[4],
            second: format[5]
        };
    }

    onMonthChange(e) {
        this.setState({month: e.target.value});

        let object = _.clone(this.state);
        object['month'] = e.target.value;
        let newMoment = moment(Object.values(object).join('-'), "YYYY-MM-DD-HH-mm-ss");
        this.props.callBack(newMoment.toDate());
    }

    onChange(key, e) {
        let last = this.state[key];
        let newValue = e.target.value;

        let object = _.clone(this.state);
        object[key] = e.target.value;
        let newMoment = moment(Object.values(object).join('-'), "YYYY-MM-DD-HH-mm-ss");
        if (!newMoment.isValid()) {
            newValue = last;
        }
        switch (key) {
            case "year":
                this.setState({"year": newValue});
                break;
            case "month":
                this.setState({"month": newValue});
                break;
            case "day":
                this.setState({"day": newValue});
                break;
            case "hour":
                this.setState({"hour": newValue});
                break;
            case "minute":
                this.setState({"minute": newValue});
                break;
            case "second":
                this.setState({"second": newValue});
                break;
        }
        if (newMoment.isValid()) {
            this.props.callBack(newMoment.toDate());
        }
    }

    render() {
        let months = [];
        let monthTemp = [
            {value: "01", title: "01-Jan"},
            {value: "02", title: "02-Feb"},
            {value: "03", title: "03-Mar"},
            {value: "04", title: "04-Apr"},
            {value: "05", title: "05-May"},
            {value: "06", title: "06-Jun"},
            {value: "07", title: "07-Jul"},
            {value: "08", title: "08-Aug"},
            {value: "09", title: "09-Sep"},
            {value: "10", title: "10-Oct"},
            {value: "11", title: "11-Nov"},
            {value: "12", title: "12-Dec"}
        ];
        let currentMonth = this.state.month;
        _.forEach(monthTemp, function (item, index) {
            if (item.value == currentMonth) {
                months.push(<option key={index} value={item.value} selected="selected">{item.title}</option>);
            } else {
                months.push(<option key={index} value={item.value}>{item.title}</option>);
            }
        });

        return (
          <fieldset className="inline-edit-date">
              <legend>
                  <span className="title">Date</span>
              </legend>
              <div className="timestamp-wrap">
                  <label>
                      <span className="screen-reader-text">Month</span>
                      <select name="mm" onChange={this.onMonthChange.bind(this)}>
                          {months}
                      </select>
                  </label>
                  <label>
                      <span className="screen-reader-text">Day</span>
                      <input type="text"
                             name="jj"
                             value={this.state.day}
                             size="2"
                             maxLength="2"
                             onChange={this.onChange.bind(this, 'day')}/>
                  </label>,
                  <label>
                      <span className="screen-reader-text">Year</span>
                      <input
                          type="text"
                          name="aa"
                          value={this.state.year}
                          size="4"
                          maxLength="4"
                          onChange={this.onChange.bind(this, 'year')}/>
                  </label>
                  @
                  <label>
                      <span className="screen-reader-text">Hour</span>
                      <input
                          type="text"
                          name="hh"
                          value={this.state.hour}
                          size="2"
                          maxLength="2"
                          onChange={this.onChange.bind(this, 'hour')}/>
                  </label>:
                  <label>
                      <span className="screen-reader-text">Minute</span>
                      <input
                          type="text"
                          name="mn"
                          value={this.state.minute}
                          size="2"
                          maxLength="2"
                          onChange={this.onChange.bind(this, 'minute')}/>
                  </label>
              </div>
              <input type="hidden" id="ss" name="ss" value="44"/>
          </fieldset>
        )

    }
}

AppAdminPostDateTime.displayName = "AppAdminPostDateTime";

module.exports = AppAdminPostDateTime;
export default AppAdminPostDateTime;
