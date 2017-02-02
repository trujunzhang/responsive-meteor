import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';

class AppAdminEditCategories extends Component {

    constructor(props) {
        super(props);

        let categories = this.props.categories;
        let categoryGroup = {};
        if (!!categories) {
            _.forEach(categories, function (value) {
                categoryGroup[value] = true;
            });
        }
        this.state = this.initialState = {
            categoryGroup: categoryGroup
        };
    }

    onCategoryChange(event) {
        const {categoryGroup} = this.state;
        categoryGroup[event.target.value] = event.target.checked;
        this.setState({categoryGroup: categoryGroup});

        let categories = [];
        _.forEach(this.state.categoryGroup, function (value, key, object) {
            if (!!value) {
                categories.push(key);
            }
        });
        this.props.onChange(categories);
    }

    render() {
        const {results} = this.props;

        const categoriesOptions = [];
        let self = this;
        if (!!results && results.length > 0) {
            results.map((cat, index) => {
                let catId = cat._id;
                let exist = (catId in self.state.categoryGroup);
                let checked = exist ? self.state.categoryGroup[catId] : false;
                categoriesOptions.push(
                  <li key={index} className="popular-category">
                      <label className="selectit">
                          <input
                            value={catId}
                            type="checkbox"
                            name="post_category[]"
                            checked={checked}
                            onChange={self.onCategoryChange.bind(self)}
                          />
                          {" " + cat.name}
                      </label>
                  </li>
                );
            })
        }

        return (

          <ul className="cat-checklist category-checklist">

              {categoriesOptions}

          </ul>
        )

    }
}

AppAdminEditCategories.displayName = "AppAdminEditCategories";

module.exports = AppAdminEditCategories;
export default AppAdminEditCategories;
