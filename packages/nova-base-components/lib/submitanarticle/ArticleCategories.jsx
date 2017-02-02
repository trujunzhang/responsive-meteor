import React, {PropTypes, Component} from 'react';
import {ModalTrigger} from "meteor/nova:core";

let Select = require('react-select');

class ArticleCategories extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            categories: this.props.categories,
        };
    }

    handleMultiChange(options) {
        let categories = _.pluck(options, 'value');
        this.setState({categories: categories});
        this.props.onCategoryChange(categories);
    }

    render() {
        let options = [];

        let collection = this.props.categoriesList;
        _.forEach(collection, function (item) {
            options.push({value: item._id, label: item.name})
        });

        return (
          <Select
            name="form-field-name"
            multi={true}
            backspaceRemoves={true}
            value={this.state.categories}
            placeholder={"Select Categories (Required)"}
            options={options}
            onChange={this.handleMultiChange.bind(this)}
          />
        )
    }
}

module.exports = ArticleCategories;
export default ArticleCategories;
