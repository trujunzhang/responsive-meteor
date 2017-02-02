import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Users from 'meteor/nova:users';
import {withRouter} from 'react-router'

class HeaderContentSearchBar extends Component {

    constructor(props) {
        super(props);
        let query = props.router.location.query.query;
        if (!!props.router.location.query.topicId) {
            query = "";
        }
        this.state = this.initialState = {
            search: query || ''
        }
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if(!nextProps.router.location.query.query){
            this.setState({search:''});
        }
    }

    search(e) {
        const input = e.target.value;
        this.setState({search: input});

        const router = this.props.router;
        const query = input === '' ? {} : {query: input};

        this.context.messages.delayEvent(function () {
            router.push({pathname: "/", query: query});
        }, 700);
    }

    render() {
        return (
            <label className="inputGroup u-sm-hide metabar-predictiveSearch u-baseColor--placeholderNormal  u-lineHeight30 u-height32 u-verticalAlignMiddle" title="Search Articles">
                <span className="svgIcon svgIcon--search svgIcon--25px u-fillTransparentBlackNormal u-baseColor--iconLight">
                    <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">
                        <path d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"/>
                    </svg>
                </span>
                <input className="js-predictiveSearchInput textInput textInput--rounded textInput--darkText u-baseColor--textNormal textInput--transparent  u-lineHeight30 u-height32 u-verticalAlignMiddle" type="search"
                       value={this.state.search}
                       placeholder="Search Articles"
                       onChange={this.search.bind(this)}
                       required="true"/>
            </label>
        )
    }
}

HeaderContentSearchBar.contextTypes = {
    currentUser: React.PropTypes.object,
    messages: React.PropTypes.object
};

module.exports = withRouter(HeaderContentSearchBar);
export default withRouter(HeaderContentSearchBar);
