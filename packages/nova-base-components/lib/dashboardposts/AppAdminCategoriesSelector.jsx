import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {withRouter} from 'react-router';

class AppAdminCategoriesSelector extends Component {

    constructor(props) {
        super(props);

        let cat_slug = !!this.props.location.query.cat ? this.props.location.query.cat : "";
        this.state = this.initialState = {
            //catSelector: 'All Categories'
            //catSelector: 'politics'
            catSelector: cat_slug
        };
    }

    onCatSelectorChange(event) {
        let slug = event.target.value;
        this.setState({catSelector: slug});
        this.props.onChange(slug);
    }

    render() {
        const {results} = this.props;

        const categoriesOptions = [];
        categoriesOptions.push(
            <option
                key='allcategories'
                value="">
                All Categories
            </option>
        );
        if (!!results && results.length > 0) {
            results.map((item, index) => {
                categoriesOptions.push(
                    <option
                        key={index}
                        className="level-0"
                        value={item.slug}>
                        {item.name}
                    </option>
                );
            })
        }

        const cat_slug = !!this.props.location.query.cat ? this.state.catSelector : "";

        return (
          <select name="cat"
                  id="cat"
                  className="postform"
                  onChange={this.onCatSelectorChange.bind(this)}
                  value={cat_slug}>
              {categoriesOptions}
          </select>
        )
    }
}

AppAdminCategoriesSelector.displayName = "AppAdminCategoriesSelector";

module.exports = withRouter(AppAdminCategoriesSelector);
export default withRouter(AppAdminCategoriesSelector);
