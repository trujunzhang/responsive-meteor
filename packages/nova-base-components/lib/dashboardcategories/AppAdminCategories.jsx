import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Posts from "meteor/nova:posts";
import Categories from "meteor/nova:categories";
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';

class AppAdminCategories extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {};
    }

    render() {
        return (
          <div className="wrap" id="admin-posts-ui">
              <h1 className="admin-posts-title">
                  Categories
                  <Telescope.components.AppSearchTitle/>
              </h1>

              <div id="col-container" className="wp-clearfix">

                  <div id="col-left">
                      <div className="col-wrap">
                          <Telescope.components.AppAdminCategoryEditForm newCat={{}}/>
                      </div>
                  </div>

                  <div id="col-right">
                      <div className="col-wrap">
                          {this.renderRightPanel()}
                      </div>
                  </div>

              </div>
          </div>
        )

    }

    renderRightPanel() {
        const params = {
            ...this.props.location.query,
            listId: "admin.categories.list",
            limit: 0
        };
        const {selector, options} = Posts.parameters.get(params);

        return (
          <Telescope.components.AdminListContainer
            collection={Categories}
            limit={0}
            component={Telescope.components.AppAdminCategoriesList}
            counterNames={[Categories.getCounterKeyName()]}
            listId={params.listId}
          />
        )

    }
}

AppAdminCategories.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminCategories.displayName = "AppAdminCategories";

module.exports = withRouter(AppAdminCategories);
export default withRouter(AppAdminCategories);
