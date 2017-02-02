import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";

class DayNames extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return ( <div className="week names">
              <span className="day">Sun</span>
              <span className="day">Mon</span>
              <span className="day">Tue</span>
              <span className="day">Wed</span>
              <span className="day">Thu</span>
              <span className="day">Fri</span>
              <span className="day">Sat</span>
          </div>
        )
    }
}

DayNames.displayName = "DayNames";

module.exports = DayNames;
    