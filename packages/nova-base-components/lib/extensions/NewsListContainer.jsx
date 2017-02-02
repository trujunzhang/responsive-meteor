import ReactMixin from 'react-mixin';
import React, {PropTypes, Component} from 'react';

const Subs = new SubsManager();

class NewsListContainer extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState = {
            limit: this.props.limit,
            firstPagination: true
        };
    }

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
            terms.options.limit = this.state.limit;
            terms.listId = this.props.listId;

            //const subscribeFunction = this.props.cacheSubscription ? Subs.subscribe.bind(Subs) : Meteor.subscribe;
            const subscribeFunction = Meteor.subscribe;
            const subscription = subscribeFunction(this.props.publication, terms);
            data.ready = subscription.ready();
        }

        const selector = this.props.selector || {};
        const options = {...this.props.options, limit: this.state.limit};
        const cursor = this.props.collection.find(selector, options);

        data.count = cursor.count();

        let results = cursor.fetch();

        // look for any specified joins
        if (this.props.joins) {

            // loop over each document in the results
            results.forEach(document => {

                // loop over each join
                this.props.joins.forEach(join => {

                    const collection = typeof join.collection === "function" ? join.collection() : join.collection;
                    const joinLimit = join.limit ? join.limit : 0;

                    if (join.foreignProperty) {
                        // foreign join (e.g. comments belonging to a post)

                        // get the property containing the id
                        const foreignProperty = document[join.foreignProperty];
                        const joinSelector = {};
                        joinSelector[join.foreignProperty] = document._id;
                        document[join.joinAs] = collection.find(joinSelector);

                    } else {
                        // local join (e.g. a post's upvoters)

                        // get the property containing the id or ids
                        const localProperty = document[join.localProperty];

                        if (Array.isArray(localProperty)) { // join property is an array of ids
                            document[join.joinAs] = collection.find({_id: {$in: localProperty}}, {limit: joinLimit}).fetch();
                        } else { // join property is a single id
                            document[join.joinAs] = collection.findOne({_id: localProperty});
                        }
                    }

                });

                // return the updated document
                return document;

            });
        }

        // transform list into tree
        if (this.props.parentProperty) {
            results = Utils.unflatten(results, "_id", this.props.parentProperty);
        }

        // by default, always assume there's more to come while data isn't ready, and then
        // just keep showing "load more" as long as we get back as many items as we asked for

        data.hasMore = !data.ready || data.count === this.state.limit;

        if (this.props.increment === 0) {

            // if increment is set to 0, hasMore is always false.
            data.hasMore = false;

            // } else if (terms && CursorCounts.get(terms)) {

            //   // note: doesn't actually work

            //   // note: it only makes sense to figure out a cursor count for cases
            //   // where we subscribe from the client to the server (i.e. `terms` should exist)

            //   const totalCount = CursorCounts.get(terms);

            //   data.totalCount = totalCount;
            //   data.hasMore = data.count < data.totalCount;

        } else if (typeof Counts !== "undefined" && !!Counts.get) {

            // or, use publish-counts package if available:
            // (currently only works on client)
            data.totalCount = Counts.get(this.props.listId);
            data.hasMore = data.count < data.totalCount;

        }

        data.firstPagination = this.state.firstPagination;
        data[this.props.resultsPropName] = results;

        return data;
    }

    render() {
        if (this.props.component) {
            const Component = this.props.component;
            return <Component {...this.props.componentProps} {...this.data} loadMore={this.loadMore.bind(this)}/>;
        } else {
            return React.cloneElement(this.props.children, {...this.props.componentProps, ...this.data, loadMore: this.loadMore.bind(this)});
        }
    }

    loadMore() {
        this.setState({
            limit: this.state.limit + this.props.increment,
            firstPagination: false
        });
    }

}

NewsListContainer.contextTypes = {
    messages: React.PropTypes.object
};

NewsListContainer.propTypes = {
    collection: React.PropTypes.object.isRequired,  // the collection to paginate
    selector: React.PropTypes.object,               // the selector used in collection.find()
    options: React.PropTypes.object,                // the options used in collection.find()
    publication: React.PropTypes.string,            // the publication to subscribe to
    terms: React.PropTypes.any,                     // an object passed to the publication
    limit: React.PropTypes.number,                  // the initial number of items to display
    increment: React.PropTypes.number,              // the limit used to increase pagination
    joins: React.PropTypes.array,                   // joins to apply to the results
    parentProperty: React.PropTypes.string,         // if provided, use to generate tree
    component: React.PropTypes.func,                // another way to pass a child component
    componentProps: React.PropTypes.object,         // the component's properties
    resultsPropName: React.PropTypes.string,        // if provided, the name of the property to use for results
    cacheSubscription: React.PropTypes.bool,        // set to true to cache subscription using Subs Manager
    listId: React.PropTypes.string,                 // a unique ID or name for the current list
};

ReactMixin(NewsListContainer.prototype, ReactMeteorData);

NewsListContainer.defaultProps = {
    limit: 10,
    increment: 10,
    resultsPropName: "results",
    cacheSubscription: false
};

module.exports = NewsListContainer;
export default NewsListContainer;