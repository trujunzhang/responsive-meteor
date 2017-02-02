import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";
import {withRouter} from 'react-router';

class PostsPage extends Component {

    constructor(props) {
        super(props);

        const {post} = this.props;
        let cachedIds = post.relatedIds ? post.relatedIds : [];
        this.state = this.initialState = {
            isSubmitting: false,
            // Status
            status: post.status,
            // Related posts
            cachedIds: cachedIds
        };
    }

    onFlagClick() {
        const {post} = this.props;
        const {currentUser, messages} = this.context;
        if (!currentUser) {
            messages.showLoginUI();
        } else {
            let offset = $(this.refs.submitFlagButton).offset();
            let top = offset.top + 14;
            let left = offset.left - 105;
            let width = 60;
            let height = 20;
            messages.showPopoverMenu("submitFlag", {postId: post._id, authorId: post.userId, title: post.title}, top, left, width, height);
        }
    }

    onTagClick(topic) {
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {topicId: topic._id}}, topic.name);
    }

    renderFlag() {
        return (
          <div className="actions_1GPvO title_2vHSk subtle_1BWOT base_3CbW2" id="post-detail-submit-flag" ref="submitFlagButton">
              <a className="flag_1WIWE action_Tsg82" onClick={this.onFlagClick.bind(this)}>
                  <span className="icon_Q-ny2">
                    <svg width="12" height="15" viewBox="0 0 12 15">
                        <path d="M0,15 L0,0 L1,0 L1,15 L0,15 Z M12,8 L2,8 L2,1 L12,1 L10,4.5 L12,8 Z" fillOpacity=".5" fill="#999"/>
                    </svg>
                  </span>flag</a>
          </div>
        )
    }

    renderSideRelatedList() {
        // Here, we cache the fetched related postIds, so no refresh after upvote/downvote post.
        const {cachedIds} = this.state;
        let content = null;
        if (cachedIds.length == 0) {
            content = (
              <section className="results_37tfm">
                  <Telescope.components.PostsNoResults relatedList={true}/>
              </section>
            );
        } else {
            const {relatedPostCount} = this.props;
            const terms = {view: "related", listId: `posts.related.list`, cachedIds: cachedIds, limit: relatedPostCount};
            const {selector, options} = Posts.parameters.get(terms);

            content = (
              <Telescope.components.RelatedListContainer
                key={"relatedList"}
                collection={Posts}
                publication="posts.related.list"
                selector={selector}
                options={options}
                terms={terms}
                joins={Posts.getJoins()}
                component={Telescope.components.PostsRelatedList}
                cacheSubscription={false}
                listId={terms.listId}
                limit={terms.limit}
                increment={0}
              />
            );
        }

        return (
          <div className="relatedPosts_3XCIU" rel="related-posts">
              <h2 className="heading_woLg1 heading_AsD8K title_2vHSk subtle_1BWOT base_3CbW2">
                  {"Related News"}
              </h2>
              {content}
          </div>
        )
    }

    renderPopularBottom() {
        return (
          <section className="popularTodaySection_30n6J">
              <div className="empty">
              </div>
          </section>
        )
    }

    showUserProfile(curator) {
        this.context.messages.dismissAllPopoverPosts();
        this.context.messages.pushRouter(this.props.router, {pathname: "/users/" + curator.telescope.slug});
    }

    renderCuratorAvator(curator) {
        return (
          <button ref="userProfile"
                  id="user-menu"
                  className="button button--small button--chromeless u-baseColor--buttonNormal is-inSiteNavBar js-userActions">
              <Telescope.components.UsersBlurryImageAvatar
                avatarObj={Users.getAvatarObj(curator)}
                size={32}/>
          </button>
        )
    }

    renderAddMakerIcon() {
        return (
          <a className="button_2I1re smallSize_1da-r secondaryText_PM80d simpleVariant_1Nl54 item_x2MDC" title="Suggest Makers">
              <div className="buttonContainer_wTYxi">+</div>
          </a>
        )
    }

    renderAuthor(curator, displayName) {
        return (
          <div className="makers_2HpZW">
              <span className="title_xMyDK secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">Author</span>
              <div className="item_x2MDC">
                  <a className="link_j6xU_">
                              <span className="user-image">
                                  {/*Avatar*/}
                                  {this.renderCuratorAvator(curator)}
                                  <div className="user-image--badge v-maker">A</div>
                              </span>
                  </a>
                  <a className="userName_35k43 text_3Wjo0 default_tBeAo base_3CbW2">{displayName}</a>
              </div>
              {/*{this.renderAddMakerIcon()}*/}
          </div>
        )
    }

    renderCuratorSection() {
        let curator = this.props.post.user;
        let displayName = Users.getDisplayName(curator);

        // 18/12/2016
        // Remove "Author" from all submitted articles". Only show Curator.
        if (!!curator) {
            return (
              <div className="wrapper_QLq-_">
                  <section className="container_2Ripa">
                      <div className="hunter_1sYZY">
                          <span className="title_xMyDK secondaryBoldText_1PBCf secondaryText_PM80d subtle_1BWOT base_3CbW2">Curator</span>
                          <div className="item_x2MDC">
                              <a className="link_j6xU_">
                              <span className="user-image">
                                  {/*Avatar*/}
                                  {this.renderCuratorAvator(curator)}
                                  {/*<div className="user-image--badge v-hunter">H</div>*/}
                              </span>
                              </a>
                              <a
                                onClick={this.showUserProfile.bind(this, curator)}
                                className="userName_35k43 text_3Wjo0 default_tBeAo base_3CbW2">{displayName}</a>
                          </div>
                      </div>
                      {/*{this.renderAuthor(curator,displayName)}*/}
                  </section>
              </div>
            )
        }
        return (
          <div className="post_detail_container">
          </div>
        )
    }

    render() {

        const {post, location} = this.props;
        const {currentUser} = this.context;
        let admin = Users.checkIsAdmin(location, currentUser);

        return (
          <div className="content_3X9xi">
              <div className="container_2uJxj">
                  <section className="postSection_1iIbk">
                      <div className="sectionContent_21Amp">
                          {/* Top top */}
                          <div>
                              {/*header block*/}
                              <Telescope.components.PostsSingleHeader post={post}/>
                          </div>
                          <div className="constraintWidth_ZyYbM body_1a08C">
                              <main className="main_3lfDa">
                                  {/*post's tags*/}
                                  <Telescope.components.PostsTopics post={post} callBack={this.onTagClick.bind(this)}/>
                                  {/*middle left*/}
                                  <Telescope.components.PostDetail post={post}/>
                                  {/*Curator*/}
                                  {this.renderCuratorSection()}
                                  {/*comments*/}
                                  <Telescope.components.PostsCommentsThread document={post}/>
                              </main>
                              <aside className="aside_1sJP0">
                                  {this.renderFlag()}
                                  {admin ? <Telescope.components.PostsAdminApproving post={post}/> : null}
                                  {this.renderSideRelatedList()}
                              </aside>
                          </div>
                      </div>
                  </section>
                  {this.renderPopularBottom()}
              </div>

          </div>
        )
    }
}

PostsPage.contextTypes = {
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
    messages: React.PropTypes.object
};

PostsPage.displayName = "PostsPage";

module.exports = withRouter(PostsPage);
export default withRouter(PostsPage);
