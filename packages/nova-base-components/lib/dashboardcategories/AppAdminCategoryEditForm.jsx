import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import {ModalTrigger} from "meteor/nova:core";
import {FormattedMessage, intlShape} from 'react-intl';
import Users from "meteor/nova:users";
import Comments from "meteor/nova:comments";
import {withRouter} from 'react-router';


class AppAdminCategoryEditForm extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            nameValue: this.props.newCat['name'] ? this.props.newCat['name'] : "",
            slugValue: this.props.newCat['slug'] ? this.props.newCat['slug'] : "",
            descriptionValue: this.props.newCat['description'] ? this.props.newCat['description'] : "",
        };
    }

    onSubmitCategoryClick() {
        const category = {name: this.state.nameValue, slug: this.state.slugValue, description: this.state.descriptionValue, order: 0};
        this.context.actions.call('categories.submit.new', category, () => {
            this.setState({
                nameValue: "",
                slugValue: "",
                descriptionValue: "",
            })
        });
    }

    render() {
        return (
          <div className="form-wrap">
              <h2>Add New Category</h2>
              <div id="addtag" method="post" className="validate">
                  <div className="form-field form-required term-name-wrap">
                      <label >Name</label>
                      <input
                        name="cat-name"
                        id="cat-name"
                        type="text"
                        size="40"
                        value={this.state.nameValue}
                        onChange={(e)=>this.setState({"nameValue": e.target.value})}
                      />
                      <p>The name is how it appears on your site.</p>
                  </div>
                  <div className="form-field term-slug-wrap">
                      <label >Slug</label>
                      <input
                        name="slug"
                        id="cat-slug"
                        type="text"
                        size="40"
                        value={this.state.slugValue}
                        onChange={(e)=>this.setState({"slugValue": e.target.value})}
                      />
                      <p>The “slug” is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.</p>
                  </div>
                  <div className="form-field term-description-wrap">
                      <label >Description</label>
                      <textarea
                        name="description"
                        id="tag-description"
                        rows="5"
                        cols="40"
                        defaultValue={this.state.descriptionValue}
                        value={this.state.descriptionValue}
                        onChange={(e)=>this.setState({"descriptionValue": e.target.value})}
                      />
                      <p>The description is not prominent by default; however, some themes may show it.</p>
                  </div>

                  <p className="submit">
                      <input type="submit" name="submit" id="submit" className="button button-primary" value="Add New Category" onClick={this.onSubmitCategoryClick.bind(this)}/>
                  </p>
              </div>
          </div>
        )

    }
}

AppAdminCategoryEditForm.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

AppAdminCategoryEditForm.displayName = "AppAdminCategoryEditForm";

module.exports = withRouter(AppAdminCategoryEditForm);
export default withRouter(AppAdminCategoryEditForm);
