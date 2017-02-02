import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {Button} from 'react-bootstrap';
import moment from 'moment';

class CollectionsLoading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className="posts-daily">
          </div>
        )
    }
}

module.exports = CollectionsLoading;
export default CollectionsLoading;
