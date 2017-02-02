import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';

class PostsSingleHeader extends Component {
    // A: Remove “THE-VIEWSPAPER” from there
    // B: YES
    // A: “theviewspaper.net” on a line between the title and read more and link it to the domain page
    // B: “theviewspaper.net” on a line between the title and read more and link it to the domain page, need to add click event?
    // A: YES

    onDomainClick(sourceFrom) {
        this.context.messages.dismissAllPopoverPosts();
        this.context.messages.pushNewLocationPathWithDelay(this.props.router, {pathname: "/", query: {from: sourceFrom}});
    }

    onSaveButtonClick(event) {
        event.preventDefault();
        const {post} = this.props;
        const {currentUser}= this.context;
        if (!currentUser) {
            const title = 'save "' + post.title + '" to collection.';
            this.context.messages.showLoginUI(title);
        } else {
            let offset = $(this.refs.saveButton).offset();
            let top = offset.top + 14;
            let left = offset.left - 105;
            let width = 60;
            let height = 20;
            this.context.messages.showPopoverMenu("SaveButton", {title: post.title, savedPostId: post._id}, top, left, width, height);
        }
    }

    renderThumbnail(imageSet) {
        const {post} = this.props;
        return (
          <div className="post-thumbnail thumbnail_1qUpA">

              <a target="_blank" href={post.url}>
                  <div className="container_22rD3" id="post-detail-thumbnail-panel">
                      <Telescope.components.BlurryImage
                        imageId={post._id + "-thumbnail"}
                        containerClass={"container__Ql6q lazyLoadContainer_3KgZD"}
                        imageClass={"post-detail-thumbnail-panel"}
                        imageSet={imageSet}
                        imageWidth={120}
                        imageHeight={120}
                        imageTitle={post.title}
                      />
                  </div>
              </a>
          </div>
        )
    }

    renderActionRight() {
        const {post} = this.props;
        return (
          <section className="container_1Nmia">
              <a
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d twitterSolidColor_G22Bs solidVariant_2wWrf shareButton_1occ0"
                href={Posts.generateTwitterShareLink(post)}
                target="_blank"
                rel="share-on-twitter">
                  <div className="buttonContainer_wTYxi">
                      <span>
                          <svg width="16px" height="13px" viewBox="0 0 16 13" version="1.1">
                              <path
                                d="M15.999,1.5367041 C15.4105184,1.79765391 14.7775382,1.97411998 14.1135589,2.05360469 C14.7910377,1.64718285 15.3115215,1.00430648 15.5570138,0.237953855 C14.9225336,0.613881561 14.2200556,0.887328975 13.472579,1.03430071 C12.8735977,0.39642338 12.0206243,-0.002 11.0766538,-0.002 C9.26371048,-0.002 7.7942564,1.46721746 7.7942564,3.27986887 C7.7942564,3.53731936 7.82325549,3.7877712 7.87925374,4.02772505 C5.15133899,3.89075139 2.73241458,2.58400269 1.11346517,0.598384541 C0.830974001,1.08329129 0.668979063,1.64668295 0.668979063,2.2485672 C0.668979063,3.3873482 1.24846095,4.39165507 2.12943342,4.98054182 C1.59145024,4.96354509 1.08546605,4.81607345 0.642479891,4.57012075 C0.641979907,4.58361815 0.641979907,4.59761546 0.641979907,4.61161277 C0.641979907,6.20180696 1.77344455,7.52805191 3.27489763,7.82949394 C2.99940624,7.90447952 2.7094153,7.94447183 2.40992466,7.94447183 C2.19843127,7.94447183 1.99293769,7.92397577 1.79244395,7.88548318 C2.20993091,9.18923246 3.42239302,10.13805 4.85884813,10.1645449 C3.73538324,11.0448756 2.31992747,11.5692748 0.781975532,11.5692748 C0.516983813,11.5692748 0.255991969,11.5537777 -0.001,11.5232836 C1.45145461,12.4546045 3.17690069,12.998 5.03084275,12.998 C11.0686541,12.998 14.3700509,7.99696174 14.3700509,3.65979581 C14.3700509,3.51732321 14.367051,3.37585041 14.3605512,3.23537743 C15.0020312,2.77246645 15.5585138,2.19457758 15.9985,1.5367041 L15.999,1.5367041 Z"
                                id="twitter" fill="#000000"/>
                          </svg>
                      </span>
                  </div>
              </a>
              <a
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d facebookSolidColor_pdgXp solidVariant_2wWrf shareButton_1occ0"
                href={Posts.generateFacebookShareLink(post)}
                target="_blank"
                rel="share-on-facebook">
                  <div className="buttonContainer_wTYxi">
                                            <span>
                                                <svg width="8" height="13" viewBox="0 0 8 14">
                                                    <path
                                                      d="M7.2 2.323H5.923c-1.046 0-1.278.464-1.278 1.16V5.11h2.44l-.35 2.438h-2.09v6.387H2.09V7.548H0V5.11h2.09V3.252C2.09 1.162 3.368 0 5.342 0c.93 0 1.742.116 1.858.116v2.207z"
                                                      fill="#FFF"/>
                                                </svg>
                                            </span>
                  </div>
              </a>
              <button
                id="post-detail-header-save-button"
                className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d simpleVariant_1Nl54 desktopOnlyButton_3SaPh shareButton_1occ0"
                ref="saveButton"
                onClick={this.onSaveButtonClick.bind(this)}>
                  <div className="buttonContainer_wTYxi">
                                            <span>
                                                <svg width="13" height="10" viewBox="0 0 13 10">
                                                    <path
                                                      d="M9,6 L6,6 L6,7 L9,7 L9,10 L10,10 L10,7 L13,7 L13,6 L10,6 L10,3 L9,3 L9,6 Z M0,0 L8,0 L8,1 L0,1 L0,0 Z M0,3 L8,3 L8,4 L0,4 L0,3 Z M0,6 L5,6 L5,7 L0,7 L0,6 Z"
                                                      fill="#FFF"/>
                                                </svg>
                                            </span>
                  </div>
              </button>
          </section>
        )
    }

    renderAction() {
        const {post} = this.props;
        const sourceFrom = (post.sourceFrom ? post.sourceFrom : '').replace('www.', '');

        return (
          <div className="actions_vQA0Z">
              <span className="comboButton_1rStc tech_25H3R">
                  <span
                    className="secondaryBoldText_1PBCf secondaryText_PM80d default_tBeAo base_3CbW2">
                      <span className="inactiveLink_C7GyP baseLink_8cU0P">
                          <a target="_blank" href={post.url}>read more</a>
                      </span>
                  </span>
              </span>
              {/*article's upvote/downvote button*/}
              <Telescope.components.ArticleUpvote post={post}/>
              <Telescope.components.ArticleDownvote post={post}/>
              <a className="posts_single_domain"
                 onClick={this.onDomainClick.bind(this, post.sourceFrom)}>
                  <h2 className="headline-source-from tagline_1Y-13 text_3Wjo0 inverse_1CN6F base_3CbW2">{sourceFrom}</h2>
              </a>
              {this.renderActionRight()}
          </div>
        )
    }

    render() {
        const {post} = this.props;
        const imageSet = Posts.getThumbnailSet(post);
        const sourceFrom = (post.sourceFrom ? post.sourceFrom : '').replace('www.', '');

        let thumbnails = [];
        if (!!imageSet.small) {
            thumbnails.push(
              <div key={post._id} className="post-thumbnail thumbnail_1qUpA">
                  <a target="_blank" href={post.url}>
                      <div className="container_22rD3" id="post-detail-thumbnail-panel">
                          <Telescope.components.BlurryImage
                            imageId={post._id + "-thumbnail"}
                            containerClass={"container__Ql6q lazyLoadContainer_3KgZD"}
                            imageClass={"post-detail-thumbnail-panel"}
                            imageSet={imageSet}
                            imageWidth={120}
                            imageHeight={120}
                            imageTitle={post.title}
                          />
                      </div>
                  </a>
              </div>)
        }

        return (
          <div>
              <header className="backgroundImage_1hK9M header_1OPY8 post_detail_header">
                  <div className="constraintWidth_ZyYbM content_1Truy">
                      <main className="main_3Naik">
                          {thumbnails}
                          <div className="info_F11MZ">
                              <div className="row">
                                  <div className="headlineContainer_3dPf_">
                                      <a target="_blank" href={post.url}>
                                          <h1 className="article_headline_azIav inverse_1CN6F base_3CbW2">{post.title} </h1>
                                      </a>
                                  </div>
                                  {this.renderAction()}
                              </div>
                          </div>
                      </main>
                  </div>
                  <div className="timestamp_3yr9h">
                    <span className="secondaryText_PM80d inverse_1CN6F base_3CbW2">
                        <time className="post_header_right_time">
                            {/*2 months ago*/}
                            {post.createdAt ? <FormattedRelative value={post.createdAt}/> : ""}
                        </time>
                    </span>
                  </div>
              </header>
          </div>
        )

    }
}

PostsSingleHeader.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

PostsSingleHeader.displayName = "PostsSingleHeader";

module.exports = withRouter(PostsSingleHeader);
export default withRouter(PostsSingleHeader);
