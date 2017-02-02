import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

let md5 = require('blueimp-md5');

/**
 * Make day wise groups on category pages, remove calendar widget from tag and source pages
 * So calendar will only show on “Homepage” and “Category” page
 * Homepage and category pages will have day wise groups
 */
class PostsHome extends Component {

    constructor(props) {
        super(props);
    }

    renderPostDaily() {
        // TODO: FIXME: djzhang
        //  On homepage - Popular posts this week + today + yesterday + 1 more day to be show
        //  Popular posts = 5 posts
        //   Today = 20 posts
        //   Yesterday = 10 Posts
        //   Other days = 10 Posts
        //   Number of posts to be shown before “Show More” Button

        return Users.renderWithSideBar(<Telescope.components.PostsDaily key={"postDaily"}/>);
    }

    renderPostSingle() {
        let query = this.context.messages.lastAction.query;
        return (
          <div className="constraintWidth_ZyYbM container_3aBgK">
              <Telescope.components.PostsSingle params={{"slug": query.title, "_id": query.postId}}/>
          </div>
        )
    }

    renderPostList(key) {
        const query = this.context.messages.lastAction.query;
        const limit = Telescope.settings.get("postsPerPage", 10);

        const terms = {...query, listId: "posts.list.main", view: 'new', limit: limit};
        const {selector, options} = Posts.parameters.get(terms);

        const componentProps = Posts.generatePostListTitle(query);
        return Users.renderWithSideBar(
          <Telescope.components.NewsListContainer
            collection={Posts}
            publication="posts.list"
            selector={selector}
            options={options}
            terms={terms}
            joins={Posts.getJoins()}
            component={Telescope.components.PostsList}
            componentProps={{...componentProps, limit: terms.limit}}
            cacheSubscription={false}
            listId={terms.listId}
            limit={terms.limit}
          />);
    }

    render() {
        const {location} = this.props;
        const {messages} = this.context;
        if (location.query.action == "new") {
            return (
              <Telescope.components.SubmitAnArticle />
            )
        }
        else if (location.query.action == "edit") {
            return (
              <Telescope.components.PostDocumentContainer
                collection={Posts}
                publication="posts.single"
                selector={{_id: location.query.editId}}
                terms={{_id: location.query.editId}}
                joins={Posts.getJoins()}
                component={Telescope.components.SubmitAnArticle}
              />
            )
        }
        else if (messages.isShowPopoverPosts()) {
            switch (messages.lastAction.type) {
                case "postdaily":
                    return this.renderPostDaily();
                case "postlist":
                    return this.renderPostList(messages.lastAction.key);
                case "postsingle":
                    return this.renderPostSingle();
            }
        } else {
            return this.renderCommon();
        }
    }

    renderCommon() {
        const {location} = this.props;
        const {messages} = this.context;
        if (Users.checkIsHomepage(location)) {
            messages.lastAction = {type: "postdaily", query: location.query};
            return this.renderPostDaily();
        }
        else if (location.query.postId) {
            messages.lastAction = {type: "postsingle", query: location.query};
            return this.renderPostSingle();
        }
        else {
            let key = md5(location.search);
            messages.lastAction = {type: "postlist", query: location.query, key: key};
            return this.renderPostList(key);
        }
    }
}

PostsHome.contextTypes = {
    messages: React.PropTypes.object
};

PostsHome.displayName = "PostsHome";

module.exports = withRouter(PostsHome);
export default withRouter(PostsHome);
