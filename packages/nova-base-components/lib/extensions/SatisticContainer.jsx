import ReactMixin from 'react-mixin';
import React, {PropTypes, Component} from 'react';

class SatisticContainer extends Component {

    getMeteorData() {

        let terms;

        // initialize data object with current user, and default to data being ready
        let data = {
            currentUser: Meteor.user(),
            ready: true
        };

        // subscribe if needed. Note: always subscribe first, otherwise
        // it won't work when server-side rendering with FlowRouter SSR
        if (this.props.publication) {
            terms = _.clone(this.props.terms) || {};

            // set subscription terms limit based on component state
            if (!terms.options) {
                terms.options = {}
            }
            terms.listId = this.props.listId;

            const subscribeFunction = Meteor.subscribe;
            const subscription = subscribeFunction(this.props.publication, terms);
            data.ready = subscription.ready();
        }

        if (typeof Counts !== "undefined" && Counts.get) {
            this.props.countKeys.map(function (key) {
                if (Counts.get(key)) {
                    data[key] = Counts.get(key);
                }
            });
        }

        return data;
    }

    render() {
        if (this.props.component) {
            const Component = this.props.component;
            return <Component {...this.props.componentProps} {...this.data} />;
        }
    }

}

SatisticContainer.propTypes = {
    countKeys: React.PropTypes.array.isRequired,  // the collection to paginate
    publication: React.PropTypes.string,            // the publication to subscribe to
    component: React.PropTypes.func,                // another way to pass a child component
    componentProps: React.PropTypes.object,         // the component's properties
};

ReactMixin(SatisticContainer.prototype, ReactMeteorData);

module.exports = SatisticContainer;
export default SatisticContainer;