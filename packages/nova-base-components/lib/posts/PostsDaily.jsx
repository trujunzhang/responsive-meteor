import Telescope from 'meteor/nova:lib';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import React, {PropTypes, Component} from 'react';

import Cookie from 'react-cookie';
import moment from 'moment';

class PostsDaily extends Component {

    constructor(props) {
        super(props);

        const showPopularPostsThisWeek = Cookie.load('showPopularPostsThisWeek') !== "no";

        this.state = {days: props.days, showPopularPostsThisWeek: showPopularPostsThisWeek};
    }

    // for a number of days "n" return dates object for the past n days
    getLastNDates(n) {
        let map = _.range(n).map(
          i => moment().subtract(i, 'days').startOf('day').toDate()
        );
        return map;
    }

    loadMoreDays(e) {
        e.preventDefault();
        this.setState({
            days: this.state.days + this.props.increment
        });
    }

    render() {
        const postsDays = [];
        if (this.state.showPopularPostsThisWeek) {
            postsDays.push(<Telescope.components.PostsPopularThisWeek key={100} callBack={e => {
                this.setState({showPopularPostsThisWeek: false})
            }}/>)
        }
        const days = this.getLastNDates(this.state.days);
        days.map((date, index) => {
            postsDays.push(<Telescope.components.PostsDay key={index} date={date} number={index}/>);
        });

        return (
          <div className="results_37tfm" id="post-daily-panel">
              {postsDays}
              <a className="posts-load-more-days" onClick={this.loadMoreDays.bind(this)}>Load More Days</a>
          </div>
        )
    }
}

PostsDaily.propTypes = {
    days: React.PropTypes.number,
    increment: React.PropTypes.number
};

PostsDaily.defaultProps = {
    days: 3,
    increment: 3
};

module.exports = PostsDaily;
export default PostsDaily;
