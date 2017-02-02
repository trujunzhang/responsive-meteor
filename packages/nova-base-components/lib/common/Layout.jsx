import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router'
import {FlashContainer, PopupPostsContainer} from "meteor/nova:core";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

class Layout extends Component {
    constructor(props, context) {
        super(props);

        const {messages}=context;
        messages.registerLayout(this);

        const {router} = props;
        router.listen((location) => {
            messages.listenBrowserBackAction(router, location, location.action);
        });
        router.listenBefore((location) => {
            messages.listenBeforeBrowserBackAction(router, location, location.action);
        });

        this.state = this.initialState = {
            isSearching: false,
            // popover menu
            popoverMenu: null,
            didMount: false,
            // Refresh homepage
            needRefreshHomePage: Users.needDelayRefresh(props.location)
        };
    }

    componentDidMount() {
        this.setState({didMount: true});
        if (Users.needDelayRefresh(this.props.location)) {
            this.context.messages.refreshHomePage();
        }
    }

    renderDelayLoading() {
        const componentProps = Posts.generatePostListTitle(this.props.location.query);
        return Users.renderWithSideBar(
          <section className="results_37tfm">
              {componentProps.showHeader ? (
                  <div>
                      <div className="fullWidthBox_3Dggh box_c4OJj">
                          <div className="content_DcBqe">
                              <Telescope.components.PostsListTitle  {...componentProps}/>
                          </div>
                      </div>
                  </div>
                ) : null}
              <Telescope.components.AppDelay/>
          </section>
        );
    }

    render() {
        const {popoverMenu, didMount, needRefreshHomePage} = this.state;
        if (didMount) {
            document.body.className = Users.getHtmlBodyClass(popoverMenu);
        }

        return (
          <div id="web-app-panel">

              <Telescope.components.HeadTags googleAnalytics={false} showDrift={true}/>

              <div>
                  <Telescope.components.Header {...this.props} />
              </div>

              <PopupPostsContainer component={Telescope.components.PopoverPosts}/>

              {/*Rendering the popover menus*/}
              <Telescope.components.AppPopup popoverMenu={popoverMenu}/>

              <FlashContainer component={Telescope.components.FlashMessages}/>

              <div id="container">

                  <Telescope.components.Newsletter />

                  {needRefreshHomePage ? this.renderDelayLoading() : this.props.children}

              </div>

          </div>
        )

    }
}

Layout.contextTypes = {
    messages: React.PropTypes.object
};

Layout.displayName = "Layout";

module.exports = withRouter(Layout);
export default withRouter(Layout);
