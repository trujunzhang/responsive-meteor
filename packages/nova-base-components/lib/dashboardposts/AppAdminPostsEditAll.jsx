import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Topics from "meteor/nova:topics";
import Categories from "meteor/nova:categories";
import {withRouter} from 'react-router';

class AppAdminPostsEditAll extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            // Categories
            categories: [],
            // Topics
            topicsArray: [],
            topics: [],
            suggestionTopic: '',
            // Status
            status: -1
        };
    }

    onBulkUpdateSubmitClick() {
        let itemIds = _.pluck(this.props.posts, '_id');
        let modifier = {categories: this.state.categories, topics: this.state.topics, status: parseInt(this.state.status)};
        this.context.actions.call('posts.bulk.edit', itemIds, modifier, (error, result) => {
            this.props.editAllHook(error, result);
        });
    }

    onTitleCloseIcon(post) {
        this.props.checkRow(post._id, false);
    }

    onCatSelectorGroupChange(categories) {
        this.setState({categories: categories});
    }

    renderTitle() {
        let titles = [];
        let self = this;
        _.forEach(this.props.posts, function (post) {
            titles.push(
              <div key={post._id} id="ttle">
                  <a className="table_edit_title_close_icon fa fa-close"
                     title="Remove From Bulk Edit"
                     onClick={self.onTitleCloseIcon.bind(self, post)}/>
                  {post.title}
              </div>
            )
        });

        return (
          <fieldset className="inline-edit-col-left">
              <legend className="inline-edit-legend">Bulk Edit</legend>

              <div className="inline-edit-col">
                  <div id="bulk-title-div">
                      <div id="bulk-titles">
                          {titles}
                      </div>
                  </div>
              </div>
          </fieldset>
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
                    componentProps={{onChange: this.onCatSelectorGroupChange.bind(this)}}
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

    renderSticky() {
        return (
          <label className="alignright">
              <span className="title">Sticky</span>
              <select name="sticky">
                  <option value="-1">— No Change —</option>
                  <option value="sticky">Sticky</option>
                  <option value="unsticky">Not Sticky</option>
              </select>
          </label>
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

              {/*{this.renderSticky()}*/}

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
          <tr id="bulk-edit" className="inline-edit-row inline-edit-row-post inline-edit-post bulk-edit-row bulk-edit-row-post bulk-edit-post inline-editor">
              <td colSpan="8" className="colspanchange" id="bulk-edit-row">

                  {this.renderTitle()}

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
                            onClick={this.props.onBulkEditCancelClick}
                              className="button-secondary cancel alignleft">
                              Cancel
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

AppAdminPostsEditAll.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminPostsEditAll.displayName = "AppAdminPostsEditAll";

module.exports = withRouter(AppAdminPostsEditAll);
export default withRouter(AppAdminPostsEditAll);
