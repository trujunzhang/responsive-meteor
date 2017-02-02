import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import PoliticlHistory from "meteor/nova:politicl-history";
import {ModalTrigger} from "meteor/nova:core";
import {withRouter} from 'react-router';


class AppAdminScrapyd extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            ready: false,
            items: [],
            watch: [],
            itemCount: 0,
            paginationCount: 0
        };
    }

    componentDidMount() {
        this.context.actions.call("politicl.scrapyd.logger", (error, result) => {

            if (!!error) {
            } else {
                this.setState({items: result.items, watch: result.watch, itemCount: result.counts.politicl, paginationCount: result.counts.politicl_watch, ready: true});
            }
        });
    }

    render() {
        return (
          <Telescope.components.AppAdminScrapydList
            items={this.state.items}
            watch={this.state.watch}
            itemCount={this.state.itemCount}
            paginationCount={this.state.paginationCount}
            ready={this.state.ready}
          />
        )
    }

    renderxxx() {
        const terms = {
            ...this.props.location.query,
            listId: "admin.scrapyd.list",
            limit: 10
        };
        const {selector, options} = PoliticlHistory.parameters.get(terms);

        return (
          <Telescope.components.AdminListContainer
            collection={PoliticlHistory}
            publication="app.scrapyd.admin"
            selector={selector}
            options={options}
            terms={terms}
            countKeys={["allCount", "publishCount", "tableCount"]}
            component={Telescope.components.AppAdminScrapydList}
            listId={terms.listId}
            limit={terms.limit}
          />
        )

    }
}

AppAdminScrapyd.contextTypes = {
    messages: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    actions: React.PropTypes.object,
    events: React.PropTypes.object
};

AppAdminScrapyd.displayName = "AppAdminScrapyd";

module.exports = withRouter(AppAdminScrapyd);
export default withRouter(AppAdminScrapyd);
