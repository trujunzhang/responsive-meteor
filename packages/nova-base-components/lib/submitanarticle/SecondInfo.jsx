import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import Topics from "meteor/nova:topics";
import Categories from "meteor/nova:categories";
import TextareaAutosize from 'react-textarea-autosize';

class SecondInfo extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState = {
            isSubmitting: false,
            // Post's keys
            linkValue: this.props.newPost['url'],
            titleValue: this.props.newPost['title'] ? this.props.newPost['title'] : "",
            description: this.props.newPost['body'] ? this.props.newPost['body'] : "",
            // categories is the array of the category's ids.
            categories: this.props.newPost['categories'] ? this.props.newPost['categories'] : [],
            topicsArray: this.props.newPost['topicsArray'] ? this.props.newPost['topicsArray'] : [],
            topics: this.props.newPost['topics'] ? this.props.newPost['topics'] : [],
            // For feature images
            thumbnailValue: this.props.newPost['thumbnailUrl'] ? this.props.newPost['thumbnailUrl'] : "",
            cloudinaryId: this.props.newPost['cloudinaryId'] ? this.props.newPost['cloudinaryId'] : "",
            // Suggestion for topics
            suggestionTopic: '',
            // Post's status
            status: this.props.newPost['status'] ? this.props.newPost['status'] : Posts.config.STATUS_PENDING,
        };
    }

    onNextClick(status) {
        const result = this.props.newPost;

        result ["url"] = this.state.linkValue;
        result ["thumbnailUrl"] = this.state.thumbnailValue;
        result ["cloudinaryId"] = this.state.cloudinaryId;
        result ["title"] = this.state.titleValue;
        result ["body"] = this.state.description;
        result ["categories"] = this.state.categories;
        result ["topicsArray"] = this.state.topicsArray;
        result ["topics"] = this.state.topics;
        result ["status"] = status;
        result['sourceFrom'] = Posts.parseDomain(this.state.linkValue);

        this.setState({isSubmitting: true});

        this.props.submitClick(result);
    }

    onCategoryChange(categories) {
        this.setState({categories: categories});
    }

    onTopicsChange(topics, topicsArray) {
        this.setState({topicsArray: topicsArray, topics: topics, suggestionTopic: ''});
    }

    onFeatureImageChange(thumbnailValue, cloudinaryId) {
        this.setState({thumbnailValue: thumbnailValue, cloudinaryId: cloudinaryId});
    }

    renderFeatureImage() {
        const preview = Posts.getThumbnailSet({cloudinaryId: this.state.cloudinaryId, thumbnailUrl: this.state.thumbnailValue}).large;
        return (
          <div className="field_1LaJb" id="thumbnail" onMouseOver={() => this.props.hint("thumbnail")}>
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Featured Image</span>
              <Telescope.components.ArticleFeatureImage
                thumbnailValue={this.state.thumbnailValue}
                imageId={this.state.cloudinaryId}
                preview={preview}
                onFeatureImageChange={this.onFeatureImageChange.bind(this)}
              />
              <hr className="ruler_1ti8u"/>
          </div>
        )
    }

    renderForTitle() {
        let _titleValue = this.state.titleValue;
        return (
          <label className="field_1LaJb" onMouseOver={() => this.props.hint("title")}>
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Title</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2" id="submit-new-topic-title-panel">
                  <input type="text"
                         name="title"
                         value={_titleValue}
                         onChange={(e) => this.setState({"titleValue": e.target.value})}
                  />
              </div>
              {_titleValue == "" ? <span className="notice_33UMT secondaryText_PM80d subtle_1BWOT base_3CbW2">required</span> : ""}
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderForDescription() {
        return (
          <label className="field_1LaJb" onMouseOver={() => this.props.hint("body")}>
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Description</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2" id="submit-new-topic-title-panel">
                  <TextareaAutosize
                    useCacheForDOMMeasurements
                    style={{boxSizing: 'border-box'}}
                    minRows={5}
                    maxRows={20}
                    value={this.state.description}
                    onChange={(e) => this.setState({description: e.target.value})}
                  />
              </div>
              {(this.state.bodyValue == "") ? <span className="notice_33UMT secondaryText_PM80d subtle_1BWOT base_3CbW2">required</span> : null}
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderForCategories() {
        return (
          <label className="field_1LaJb" onMouseOver={() => this.props.hint("categories")}>
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2" id="select-categories-title">Categories</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <ListContainer
                    collection={Categories}
                    resultsPropName="categoriesList"
                    limit={0}
                    cacheSubscription={true}
                    component={Telescope.components.ArticleCategories}
                    componentProps={{categories: this.state.categories, onCategoryChange: this.onCategoryChange.bind(this)}}
                  />
              </div>
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    onSuggestionHandle(input) {
        this.setState({suggestionTopic: input});
    }

    renderForTopics() {
        const terms = {query: this.state.suggestionTopic, limit: 15, exclude: this.state.topics, listId: "topics.suggestion.list"};
        const {selector, options} = Topics.parameters.get(terms);

        return (
          <label className="field_1LaJb" id="topics" onMouseOver={() => this.props.hint("topics")}>
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Topics</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <Telescope.components.NewsListContainer
                    collection={Topics}
                    selector={selector}
                    options={options}
                    terms={terms}
                    publication="topics.suggestion"
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
                    listId={terms.listId}
                    limit={terms.limit}
                    increment={0}
                  />
              </div>
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderForLink() {
        const {linkValue} = this.state;
        return (
          <label className="field_1LaJb">
              <span className="label_2ZD44 text_3Wjo0 subtle_1BWOT base_3CbW2">Link</span>
              <div className="group_1nlHj text_3Wjo0 default_tBeAo base_3CbW2">
                  <input
                    type="text"
                    name="url"
                    placeholder="https://"
                    value={linkValue}
                    onChange={(e) => this.setState({"linkValue": e.target.value})}
                    onMouseOver={() => this.props.hint("link")}/>
              </div>
              <hr className="ruler_1ti8u"/>
          </label>
        )
    }

    renderCommonSubmitButton(nextEnable) {
        return (
          <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM">
              <div className="buttonWithNotice_3bRZb">
                  <button
                    onClick={this.onNextClick.bind(this, Posts.config.STATUS_PENDING)}
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidletiant_2wWrf"
                    type="submit"
                    disabled={!nextEnable}>
                      <div className="buttonContainer_wTYxi article_button">Submit</div>
                  </button>
              </div>
          </div>
        )
    }

    /**
     * 1. DELETE - Make it Red
     * 2. SAVE AS DRAFT - Make it yello
     * 3. PUBLISH - Make it green
     */
    renderAdminSubmitButton(nextEnable) {
        const title = Posts.getPostStatusTitle(this.state.status);
        return (
          <div className="right_1jQ6K buttonGroup_2NmU8 right_2JztM">

              <h2 className="heading_woLg1  title_2vHSk subtle_1BWOT base_3CbW2 submitted_post_status">{"Status: (" + title + ")"}</h2>

              <div className="buttonWithNotice_3bRZb">
                  <button
                    onClick={this.onNextClick.bind(this, Posts.config.STATUS_SPAM)}
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d booksSolidColor_101bu solidletiant_2wWrf"
                    type="submit"
                    disabled={!nextEnable}>
                      <div className="buttonContainer_wTYxi article_button">SAVE AS DRAFT</div>
                  </button>
                  <button
                    onClick={this.onNextClick.bind(this, Posts.config.STATUS_DELETED)}
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d deleteSolidColor_B-2gO solidletiant_2wWrf"
                    type="submit"
                    disabled={!nextEnable}>
                      <div className="buttonContainer_wTYxi article_button">DELETE</div>
                  </button>
                  <button
                    onClick={this.onNextClick.bind(this, Posts.config.STATUS_APPROVED)}
                    className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d podcastsSolidColor_2N0RG solidletiant_2wWrf"
                    type="submit"
                    disabled={!nextEnable}>
                      <div className="buttonContainer_wTYxi article_button">PUBLISH</div>
                  </button>
              </div>
          </div>
        )
    }

    render() {
        const {titleValue, linkValue, description, categories, isSubmitting, uploading} = this.state;

        let nextEnable = ((linkValue != "") && (titleValue != "") && (description != ""));
        // When uploading the image to cloudinary, set 'submit' button to disable.
        if (uploading || isSubmitting) {
            nextEnable = false;
        }
        // All fields except topics and featured image are compulsory, user should not be able to submit an article if any of them are empty.
        if (categories.length == 0) {
            nextEnable = false;
        }
        let formStatus = "errorField_1YQ0W";

        let admin = this.context.messages.appManagement.getAdmin(this.props.location, this.context.currentUser);

        return (
          <div >
              {/*Title*/
              }
              {
                  this.renderForTitle()
              }
              {/*Feature Image*/
              }
              {
                  this.renderFeatureImage()
              }
              {/*Description*/
              }
              {
                  this.renderForDescription()
              }
              {/*Categories*/
              }
              {
                  this.renderForCategories()
              }
              {/*Topics*/
              }
              {
                  this.renderForTopics()
              }
              {/*Submit button*/
              }
              {
                  admin ? this.renderAdminSubmitButton(nextEnable) : this.renderCommonSubmitButton(nextEnable)
              }
          </div>
        )
    }
}

SecondInfo.contextTypes = {
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(SecondInfo);
export default withRouter(SecondInfo);
