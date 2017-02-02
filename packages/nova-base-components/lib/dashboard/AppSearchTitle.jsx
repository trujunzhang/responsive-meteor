import React from 'react';
import {FormattedMessage} from 'react-intl';
import {withRouter} from 'react-router'

const AppSearchTitle = (props, context) => {
    const query = props.router.location.query.query;
    if (!!query) {
        return (
          <span className="subtitle">{'Search results for “' + query + '”'}</span>
        )
    }
    return null;
};

AppSearchTitle.displayName = "AppSearchTitle";

module.exports = withRouter(AppSearchTitle);
export default withRouter(AppSearchTitle);
