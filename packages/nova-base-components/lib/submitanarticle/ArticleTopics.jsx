import React, {PropTypes, Component} from 'react';
import {ModalTrigger} from "meteor/nova:core";
import Topics from "meteor/nova:topics";
import Telescope from 'meteor/nova:lib';

import Select from 'react-select';
let md5 = require('blueimp-md5');

class ArticleTopics extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            topics: this.props.topics,
            topicsArray: this.props.topicsArray,
        };
    }

    handleMultiChange(options) {
        let updatedState =
          Topics.updateTopicsState(Telescope.settings.get("TOPICS_FILTER_KEYS", ''), this.state.topics, this.state.topicsArray, options);

        this.setState(updatedState);

        this.props.onTopicsChange(updatedState.topics, updatedState.topicsArray);
    }

    fetchSuggestionTopics(input) {
        if (!input) {
            return Promise.resolve({options: []});
        }
        let onSuggestionHandle = this.props.onSuggestionHandle;
        this.context.messages.delayEvent(function () {
            onSuggestionHandle(input);
        }, 400);
    }

    getOptions(topicsArray) {
        let options = [];

        _.forEach(topicsArray, function (item) {
            options.push({value: item._id, label: item.name})
        });
        return options;
    }

    promptTextCreator(label) {
        return 'Create Topic "' + label + '"';
    }

    render() {
        const {topicsArray, results, suggestionTopic} = this.props;

        let options = this.getOptions(topicsArray.concat(results));

        return (
          <Select.AsyncCreatable
            name="form-field-name"
            multi={true}
            ignoreCase={false}
            options={options}
            isLoading={false}
            loadOptions={this.fetchSuggestionTopics.bind(this)}
            value={this.state.topics}
            promptTextCreator={this.promptTextCreator.bind(this)}
            onChange={this.handleMultiChange.bind(this)}
          />
        )
    }
}

ArticleTopics.contextTypes = {
    messages: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object,
};

ArticleTopics.displayName = "ArticleTopics";

module.exports = ArticleTopics;
export default ArticleTopics;
