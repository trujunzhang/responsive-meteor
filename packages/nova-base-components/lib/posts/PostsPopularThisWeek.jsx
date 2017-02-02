import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer} from "meteor/utilities:react-list-container";
import moment from 'moment';
import Cookie from 'react-cookie';
import Posts from "meteor/nova:posts";

class PostsPopularThisWeek extends Component {

    constructor(props, context) {
        super(props);
        this.state = {isEventCalling: false, cachedIds: [], didMount: false};
        this.dismissBanner = this.dismissBanner.bind(this);

        const today = moment().subtract(0, 'days').startOf('day').toDate();
        const week = moment().subtract(7, 'days').startOf('day').toDate();
        context.actions.call('posts.cached.ids', {
            view: "best",
            date: today,
            after: moment(week).format("YYYY-MM-DD"),
            before: moment(today).format("YYYY-MM-DD"),
        }, (error, result) => {
            if (!!error) {
            } else {
                if (this.state.didMount) {
                    this.setState({isEventCalling: true, cachedIds: result})
                } else {
                    this.state = {isEventCalling: true, cachedIds: result};
                }
            }
        });
    }

    componentDidMount() {
        this.setState({didMount: true})
    }

    dismissBanner(e) {
        if (e && e.preventDefault) e.preventDefault();

        this.setState({showPopularPostsThisWeek: false});

        // set cookie
        Cookie.save('showPopularPostsThisWeek', "no");

        this.props.callBack();
    }

    renderLoading() {
        const loadMoreMessage = "All good things take time";
        return (
          <section className="results_37tfm">
              <div>
                  <div className="fullWidthBox_3Dggh box_c4OJj">
                      <div className="content_DcBqe">
                          <Telescope.components.PostsListTitle title="Popular posts this week" showClose={true} dismissBanner={this.dismissBanner}/>
                      </div>
                  </div>
              </div>
              <Telescope.components.PostsLoading message={loadMoreMessage}/>
          </section>
        )
    }

    render() {
        const {isEventCalling} = this.state;

        if (!!isEventCalling) {
            return this.renderPopularThisWeek();
        } else {
            return this.renderLoading();
        }
    }

    renderPopularThisWeek() {
        /**
         * Popular posts this week
         */
        const {cachedIds} = this.state;

        const terms = {view: 'popular.this.week', cachedIds: cachedIds, limit: 5, listId: "posts.list.popular.this.week"};
        const {selector, options} = Posts.parameters.get(terms);

        return (
          <div className="posts-day">
              <Telescope.components.NewsListContainer
                collection={Posts}
                publication="posts.list"
                selector={selector}
                options={options}
                terms={terms}
                joins={Posts.getJoins()}
                component={Telescope.components.PostsList}
                componentProps={
                    {
                        showHeader: true,
                        checkReady: true,
                        title: "Popular posts this week",
                        showClose: true,
                        dismissBanner: this.dismissBanner,
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

PostsPopularThisWeek.propTypes = {
    date: React.PropTypes.object,
    number: React.PropTypes.number
};

PostsPopularThisWeek.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = PostsPopularThisWeek;
export default PostsPopularThisWeek;
