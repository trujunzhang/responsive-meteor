import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import {ModalTrigger} from "meteor/nova:core";
import Categories from "meteor/nova:categories";

import {withRouter} from 'react-router';


class AppAdminCategoryItem extends Component {

    onCategoryCountClick() {
        const category = this.props.category;
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {admin: true, cat: category.slug}}, category.name);
    }

    render() {
        const category = this.props.category;

        const counterKeyName = Categories.getCounterKeyName();
        const count = category[counterKeyName] ? category[counterKeyName] : "-";
        return (
          <tr
            className="iedit author-other level-0 post-64943 type-post status-draft format-standard has-post-thumbnail hentry category-all-reads tag-article-208 tag-cauvery-basin tag-cauvery-dispute tag-cauvery-water-disputes-tribunal tag-dipak-misra tag-houses-of-legislature tag-inter-state-river-water-disputes-act tag-karnataka tag-rules-of-procedure tag-supreme-court tag-tamil-nadu tag-uday-umesh-lalit">
              <td className="title column-title has-row-actions column-primary page-title">
                  <strong>{category.name}</strong>
                  <Telescope.components.AppAdminCategoryItemAction actionEvent={this.props.actionEvent} category={category}/>
              </td>
              <td className="description column-description">
                  <strong>{category.description}</strong>
              </td>
              <td className="slug column-slug">
                  <strong>{category.slug}</strong>
              </td>
              <td className="posts column-posts">
                  <a onClick={this.onCategoryCountClick.bind(this)}>{count}</a>
              </td>
          </tr>
        )
    }

}

AppAdminCategoryItem.contextTypes = {
    messages: React.PropTypes.object
};

AppAdminCategoryItem.displayName = "AppAdminCategoryItem";

module.exports = withRouter(AppAdminCategoryItem);
export default withRouter(AppAdminCategoryItem);
