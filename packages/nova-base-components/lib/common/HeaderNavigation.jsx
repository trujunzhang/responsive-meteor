import React, {PropTypes, Component} from 'react';
import {Accounts} from 'meteor/std:accounts-ui';
import {ContextPasser} from "meteor/nova:core";
import {withRouter} from 'react-router'

class HeaderNavigation extends Component {

    onNavItemClick(cat) {
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {cat: cat.slug}}, cat.name);
    }

    render() {
        const {categories, router} = this.props;
        const currentCategorySlug = !!router.location.query.cat ? router.location.query.cat : "";

        const normalClass = "link link--darken u-accentColor--textDarken u-baseColor--link";
        const activeClass = "link link--darker link--darken u-accentColor--textDarken u-baseColor--link";

        return (
          <div className="metabar-inner u-marginAuto u-maxWidth1000 js-metabarBottom u-paddingLeft20 u-paddingRight20">
              <div className="metabar-block metabar-block--below u-height50 u-xs-height39 u-overflowHiddenY" id="header-categories-nav">
                  <ul className="browsableStreamTabs u-borderTopLightest js-trackedCatalogTabs">
                      {categories && categories.length > 0 ? categories.map((cat, index) => {
                              return (
                                <li className="browsableStreamTabs-item js-trackedCatalogTab" key={index}>
                                    <a className={ currentCategorySlug === cat.slug ? activeClass : normalClass}
                                       onClick={this.onNavItemClick.bind(this, cat)}>
                                        {cat.name}
                                    </a>
                                </li>
                              )
                          }
                        ) : null}
                  </ul>
              </div>
          </div>
        )
    }

}

HeaderNavigation.contextTypes = {
    messages: React.PropTypes.object
};

module.exports = withRouter(HeaderNavigation);
export default withRouter(HeaderNavigation);