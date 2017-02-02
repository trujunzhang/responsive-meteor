import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Categories from "meteor/nova:categories";
import Topics from "meteor/nova:topics";
import {withRouter} from 'react-router';

class AppAdminPostsEditSingle extends Component {

    constructor(props) {
        super(props);
        let post = this.props.post;
        this.state = this.initialState = {
            // Categories
            categories: post.categories ? post.categories : [],
            // Topics
            topicsArray: post.topicsArray ? post.topicsArray : [],
            topics: post.topics ? post.topics : [],
            suggestionTopic: '',
            // Status
            status: -1,
            // detail
            title: post.title ? post.title : '',
            slug: post.slug ? post.slug : '',
            postedAt: post.postedAt ? post.postedAt : new date()
        };
    }

    onBulkUpdateSubmitClick() {
        if (this.state.title === "" || this.state.slug === "") {
            return;
        }
        let itemIds = [this.props.post._id];
        let modifier = {
            title: this.state.title,
            slug: this.state.slug,
            postedAt: this.state.postedAt,
            categories: this.state.categories,
            topics: this.state.topics,
            status: parseInt(this.state.status)
        };
        this.context.actions.call('posts.single.edit', itemIds, modifier, (error, result) => {
            this.props.editSingleHook(error, result);
        });
    }

    onCatSelectorGroupChange(categories) {
        this.setState({categories: categories});
    }

    renderPostDetail() {
        return (
          <fieldset className="inline-edit-col-left">
              <legend className="inline-edit-legend">Quick Edit</legend>
              <div className="inline-edit-col">

                  <label>
                      <span className="title">Title</span>
                      <span className="input-text-wrap">
                          <input
                              type="text"
                              name="post_title"
                              className="ptitle"
                              value={this.state.title}
                                 onChange={(e) => {
                                     this.setState({title: e.target.value})
                                 }}/>
                      </span>
                  </label>

                  <label>
                      <span className="title">Slug</span>
                      <span className="input-text-wrap">
                          <input
                              type="text"
                              name="post_name"
                              value={this.state.slug}
                                 onChange={(e) => {
                                     this.setState({slug: e.target.value})
                                 }}/>
                      </span>
                  </label>


                  {this.renderPostedAt()}
                  <br className="clear"/>
              </div>
          </fieldset>
        )
    }

    onpostedAtHook(postedAt) {
        this.setState({postedAt: postedAt});
    }

    renderPostedAt() {
        let postedAt = this.state.postedAt;
        return (
          <Telescope.components.AppAdminPostDateTime
            callBack={this.onpostedAtHook.bind(this)}
            postedAt={postedAt}
          />
        )
    }

    renderCategories() {
        return (
          <fieldset className="inline-edit-col-center inline-edit-categories">
              <div className="inline-edit-col">

                  <span className="title inline-edit-categories-label">Categories</span>

                  <Telescope.components.AdminListContainer
                    collection={Categories}
                    limit={0}
                    component={Telescope.components.AppAdminEditCategories}
                    componentProps={
                        {
                            categories: this.state.categories,
                            onChange: this.onCatSelectorGroupChange.bind(this)
                        }
                                   }
                    listId={"admin.posts.edit.categories.list"}
                  />

              </div>
          </fieldset>
        )
    }

    renderAuthors() {
        return (
          <label className="inline-edit-author">
              <span className="title">Author</span>
              <select name="post_author" className="authors">
                  <option value="-1">— No Change —</option>
                  <option value="1">djzhang (djzhang)</option>
              </select>
          </label>
        )
    }

    onSuggestionHandle(input) {
        this.setState({suggestionTopic: input});
    }

    onTopicsChange(topics, topicsArray) {
        this.setState({topicsArray: topicsArray, topics: topics, suggestionTopic: ''});
    }

    renderTags() {
        return (
          <label className="inline-edit-tags">
              <span className="title">Tags</span>
              {/*<textarea cols="22" rows="1" name="tax_input[post_tag]" className="tax_input_post_tag"/>*/}

              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <Telescope.components.NewsListContainer
                    collection={Topics}
                    publication="topics.suggestion"
                    terms={{query: this.state.suggestionTopic, limit: 5, exclude: this.state.topics}}
                    component={Telescope.components.ArticleTopics}
                    componentProps={
                        {
                            onSuggestionHandle: this.onSuggestionHandle.bind(this),
                            suggestionTopic: this.state.suggestionTopic,
                            topics: this.state.topics,
                            topicsArray: this.state.topicsArray,
                            onTopicsChange: this.onTopicsChange.bind(this)
                        }
                    }
                    listId={"topics.suggestion.list"}
                    limit={0}
                    increment={0}
                  />
              </div>
          </label>
        )
    }

    renderOptionsForCommentsAndPings() {
        return (
          <div className="inline-edit-group wp-clearfix">
              <label className="alignleft">
                  <span className="title">Comments</span>
                  <select name="comment_status">
                      <option value="">— No Change —</option>
                      <option value="open">Allow</option>
                      <option value="closed">Do not allow</option>
                  </select>
              </label>
              <label className="alignright">
                  <span className="title">Pings</span>
                  <select name="ping_status">
                      <option value="">— No Change —</option>
                      <option value="open">Allow</option>
                      <option value="closed">Do not allow</option>
                  </select>
              </label>
          </div>
        )
    }

    onStatusChange(event) {
        let status = event.target.value;
        this.setState({status: status});
    }

    renderStatus() {
        let status = Posts.getNormalPostStatusSet();
        return (
          <div className="inline-edit-group wp-clearfix">
              <label className="inline-edit-status alignleft">
                  <span className="title">Status</span>
                  <select
                    name="_status"
                    value={this.state.status}
                    onChange={this.onStatusChange.bind(this)}>
                      {status.map((item, index) =>
                        <option key={index} value={item.value}>{item.title}</option>
                      )}
                  </select>
              </label>
          </div>
        )
    }

    renderFormat() {
        return (
          <label className="alignleft">
              <span className="title">Format</span>
              <select name="post_format">
                  <option value="-1">— No Change —</option>
                  <option value="0">Standard</option>
                  <option value="video">Video</option>
              </select>
          </label>
        )
    }

    render() {
        return (
          <tr className="inline-edit-row inline-edit-row-post inline-edit-post quick-edit-row quick-edit-row-post inline-edit-post inline-editor">
              <td colSpan="8" className="colspanchange" id="bulk-edit-row">

                  {this.renderPostDetail()}

                  {this.renderCategories()}

                  <fieldset className="inline-edit-col-right">

                      {this.renderTags()}

                      <div className="inline-edit-col">

                          {/*{this.renderAuthors()}*/}
                          {/*{this.renderOptionsForCommentsAndPings()}*/}

                          {this.renderStatus()}

                          {/*{this.renderFormat()}*/}
                      </div>

                  </fieldset>

                  <div>
                      <p className="submit inline-edit-save">
                          <button
                            type="button"
                            onClick={this.props.onEditSingleCancelClick}
                            className="button-secondary cancel alignleft">Cancel
                          </button>
                          <input
                            type="submit"
                            name="bulk_edit"
                            id="bulk_edit"
                            className="button button-primary orangeSolidColor_B-2gO alignright"
                            onClick={this.onBulkUpdateSubmitClick.bind(this)}
                            value="Update"/>
                      </p>
                  </div>

              </td>
          </tr>
        )

    }
}

AppAdminPostsEditSingle.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminPostsEditSingle.displayName = "AppAdminPostsEditSingle";

module.exports = withRouter(AppAdminPostsEditSingle);
export default withRouter(AppAdminPostsEditSingle);
