import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

import Posts from "meteor/nova:posts";

class SubmitAnArticle extends Component {

    constructor(props) {
        super(props);

        const {document} = this.props;

        if (document) {
            this.state = this.initialState = {
                hintKey: "title",
                formState: 'INFO', // ["LINK","INFO","MEDIA","MAKERS"]
                link: document['url'],
                newPost: document,
                embedlyLoading: false
            };
        } else {
            this.state = this.initialState = {
                hintKey: "link",
                formState: 'LINK', // ["LINK","INFO","MEDIA","MAKERS"]
                link: "",
                newPost: {},
                embedlyLoading: false
            };
        }
    }

    convertToModifiedPost(newPost) {
        return {
            url: newPost['url'],
            thumbnailUrl: newPost['thumbnailUrl'],
            title: newPost['title'],
            body: newPost['body'],
            status: newPost['status'],
            categories: newPost['categories'],
            sourceFrom: newPost['sourceFrom'],
            topicsArray: newPost['topicsArray'],
            topics: newPost['topics'],
            cloudinaryId: newPost ["cloudinaryId"]
        };
    }

    onSubmitClick(data) {
        const post = data;

        if (this.props.location.query.action == "edit") {
            const modifier = {$set: this.convertToModifiedPost(post)};
            this.context.actions.call('posts.edit', post['_id'], modifier, (error, result) => {
                if (!error) {
                    // No error, redirect to the article's detail page.
                    let query = this.context.messages.adjustAdminNewQuery(this.props.router, {postId: post._id, title: post.slug}, this.context.currentUser);
                    this.context.messages.replaceNewLocationPath(this.props.router, {pathname: "/", query: query});
                }
            });
        } else {
            // Submit the article.
            this.context.actions.call('posts.new', post, (error, result) => {
                if (!error) {
                    // No error, redirect to the article's detail page.
                    let query = this.context.messages.adjustAdminNewQuery(this.props.router, {postId: post._id, title: post.slug}, this.context.currentUser);
                    this.context.messages.replaceNewLocationPath(this.props.router, {pathname: "/", query: query});
                }
            });
        }
    }

    fetchViaEmbedly() {
        const {newPost} = this.state;
        const url = newPost.url;

        if (url.length) {
            this.setState({embedlyLoading: true});

            // the URL has changed, get a new thumbnail
            this.context.actions.call("getEmbedlyData", url, (error, result) => {

                console.log("querying Embedly…");
                this.setState({embedlyLoading: false});

                if (error) {
                    //console.log(error);
                } else {
                    //console.log(result);
                    newPost["title"] = result.title;
                    newPost["body"] = result.description;
                    newPost["thumbnailUrl"] = result.thumbnailUrl;
                    newPost["sourceFrom"] = result.sourceFrom;
                    newPost["status"] = Posts.config.STATUS_PENDING;
                }
                this.setState({formState: "INFO"});
            });

        } else {
            this.setState({formState: "INFO"});
        }
    }

    onPreviousClick() {
        switch (this.state.formState) {
            case "MEDIA":
                this.setState({formState: "INFO"});
                break;
            case "MAKERS":
                this.setState({formState: "MEDIA"});
                break;
        }

    }

    onNextClick(result) {
        if (!result) {
            return;
        }
        switch (this.state.formState) {
            case "LINK":
                // "duplicate" means that the article is exist.
                // So redirect to the article.
                if (result.status == "duplicate") {
                    let post = result.value;
                    this.context.messages.pushRouter(this.props.router, {pathname: "/", query: {postId: post._id, title: post.slug}});
                } else if (result.status == "validated") {
                    let newPost = this.state.newPost;
                    newPost["url"] = result.value.url;
                    this.fetchViaEmbedly();
                }
                break;
        }

    }

    renderWizard() {
        switch (this.state.formState) {
            case "LINK":
                return (
                  <Telescope.components.FirstTypeLink
                    nextClick={this.onNextClick.bind(this)}
                    hint={this.hintHoverSelector.bind(this)}/>
                );
            case "INFO":
                return (
                  <Telescope.components.SecondInfo
                    submitClick={this.onSubmitClick.bind(this)}
                    hint={this.hintHoverSelector.bind(this)}
                    newPost={this.state.newPost}/>
                );
        }
    }

    hintHoverSelector(hintKey) {
        this.setState({hintKey: hintKey});
    }

    renderNavMenu() {
        const navigation = ["Link", "Info"];
        const navClass = "secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2";
        const currentNavClass = "secondaryBoldText_1PBCf secondaryText_PM80d default_tBeAo base_3CbW2";

        const formState = this.state.formState.toLowerCase();
        return (
          <div className="header_3GFef">
              <nav className="navigation_2SMvt">
                  <ol>
                      {navigation.map((nav, index) => {
                            const select = (formState == nav.toLowerCase());
                            return (
                              <li key={index}><span className={ select ? currentNavClass : navClass}>{(index + 1) + ". " + nav}</span></li>
                            )
                        }
                      )}
                  </ol>
              </nav>
          </div>
        )
    }

    renderAutoFetching() {
        return (
          <div className="placeholder_1WOC3">
              <div >
                  <Telescope.components.Loading/>
                  <div>
                      <h4 id="fetching-the-article-label">Fetching the article!</h4>
                  </div>
              </div>
          </div>
        )
    }

    renderNewArticleWizard() {
        return (
          <div className="paddedBox_2UY-S box_c4OJj content_9N-p1">
              <div className="content_DcBqe">
                  {this.renderNavMenu()}
                  {this.renderWizard()}
                  <Telescope.components.HintInfo
                    hintKey={this.state.hintKey}
                  />
              </div>
          </div>
        )
    }

    render() {
        return (
          <div className="constraintWidth_ZyYbM layout_1EuVY padding_bottom_60" id="post-edit-panel">
              <span className="headline_16ZHx headline_azIav default_tBeAo base_3CbW2">
                  Submit an Article
              </span>

              {this.state.embedlyLoading ? this.renderAutoFetching() : this.renderNewArticleWizard()}
          </div>
        )
    }
}

SubmitAnArticle.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(SubmitAnArticle);
export default withRouter(SubmitAnArticle);
