import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer} from "meteor/utilities:react-list-container";
import moment from 'moment';
import Posts from "meteor/nova:posts";

class PostsDay extends Component {
    render() {

        const {date, number} = this.props;

        const title = Posts.getDailyDateTitle(date);
        let postsPerPage = (title.indexOf("Today") !== -1) ? 20 : 10;

        const terms = {
            view: "new",
            date: date,
            after: moment(date).format("YYYY-MM-DD"),
            before: moment(date).format("YYYY-MM-DD"),
            enableCache: number <= 15 ? true : false, // only cache first 15 days
            limit: postsPerPage,
            listId: `posts.list.${moment(date).format("YYYY-MM-DD")}`
        };

        const {selector, options} = Posts.parameters.get(terms);

        return (
          <div className="posts-day">
              <Telescope.components.NewsListContainer
                collection={Posts}
                publication="posts.list"
                selector={selector}
                options={{/*Here, options must be empty(So important)*/}}
                terms={terms}
                joins={Posts.getJoins()}
                component={Telescope.components.PostsList}
                componentProps={
                    {
                        showHeader: true,
                        checkReady: true,
                        title: title,
                        limit: terms.limit
                    }
                }
                listId={terms.listId}
                limit={terms.limit}
                increment={10}
              />
          </div>
        )

    }

}

PostsDay.propTypes = {
    date: React.PropTypes.object,
    number: React.PropTypes.number
};

module.exports = PostsDay;
export default PostsDay;
