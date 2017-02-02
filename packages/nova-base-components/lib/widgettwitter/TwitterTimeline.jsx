/* global twttr */

import React, {Component, PropTypes} from 'react';
//import ReactDOM from 'react-dom';

let ReactDOM = require('react-dom');

class TwitterTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = ({initialized: false});
    }

    componentDidMount() {
        if (this.state.initialized) {
            return;
        }

        if (typeof twttr === 'undefined') {
            const twittertimeline = ReactDOM.findDOMNode(this.refs.twittertimeline);
            const twitterscript = document.createElement('script');
            twitterscript.src = '//platform.twitter.com/widgets.js';
            twitterscript.async = true;
            twitterscript.id = 'twitter-wjs';
            twittertimeline.parentNode.appendChild(twitterscript);
        } else {
            twttr.widgets.load();
        }

        this.initialized();
    }

    initialized() {
        this.setState({initialized: true});
    }

    render() {
        const {height, user, widgetId, chrome, limit} = this.props;
        return (
          <a
            id="twitter-widget-for-app"
            ref="twittertimeline"
            className="twitter-timeline"
            href={`https://twitter.com/${user}`}
            data-height={height}
            data-widget-id={widgetId}
            data-chrome={chrome}
          />
        )
    }
}

TwitterTimeline.propTypes = {
    widgetId: PropTypes.string,
    user: PropTypes.string,
    chrome: PropTypes.string,
    limit: PropTypes.number,
};

module.exports = TwitterTimeline;
export default TwitterTimeline;
