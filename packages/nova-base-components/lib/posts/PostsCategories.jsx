import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class PostsCategories extends Component {

    onCategoryClick(event,category) {
        this.context.messages.pushNewLocationPathWithTitle(this.props.router, {pathname: "/", query: {cat: category.slug}}, category.name);

        event.stopPropagation();
    }

    renderxxx() {
        const categoriesArray = this.props.post.categoriesArray;

        return (
          <ul className="topics_39_B0" rel="categories-list">
              {categoriesArray.map((category, index) =>
                  <div key={index}
                       className="topicWrap_2Uvaj"
                       rel="category-item"
                       onClick={(event) =>
                           this.onCategoryClick(event, category)
                               }
                  >
                      <span>
                          <a
                              className="button_2I1re smallSize_1da-r secondaryText_PM80d greySolidColor_270pZ solidVariant_2wWrf"
                              title={category.name}>
                              <div className="buttonContainer_wTYxi">
                                  {category.name}
                              </div>
                          </a>
                      </span>
                </div>
              )}
          </ul>
        )
    }

    render() {
        const categoriesArray = this.props.post.categoriesArray;

        return (
          <ul className="posts-categories">
              {categoriesArray.map(category =>
                  <li
                      key={category._id}
                      className="posts-category"
                       onClick={(event) =>
                           this.onCategoryClick(event, category)
                               }
                  >
                    {category.name}
                </li>
              )}
          </ul>
        )
    }
}

PostsCategories.contextTypes = {
    messages: React.PropTypes.object
};

PostsCategories.displayName = "PostsCategories";

module.exports = withRouter(PostsCategories);
export default withRouter(PostsCategories);
