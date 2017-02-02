import ReactMixin from 'react-mixin';
import React, {PropTypes, Component} from 'react';

class PostDocumentContainer extends Component {

    getMeteorData() {

        // subscribe if necessary
        if (this.props.publication) {
            //const subscribeFunction = this.props.cacheSubscription ? Subs.subscribe.bind(Subs) : Meteor.subscribe;
            const subscribeFunction = Meteor.subscribe;
            const subscription = subscribeFunction(this.props.publication, this.props.terms);
        }

        const collection = this.props.collection;
        const document = collection.findOne(this.props.selector);

        // look for any specified joins
        if (document && this.props.joins) {

            // loop over each join
            this.props.joins.forEach(join => {

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
                    let localProperty = join.localProperty;
                    getAttributeValue = function () {
                        let array = localProperty.split('.');
                        let obj = document;
                        _.forEach(array, function (field) {
                            obj = obj[field];
                        });
                        return obj;
                    };

                    const joinProperty = getAttributeValue();

                    const collection = typeof join.collection === "function" ? join.collection() : join.collection;

                    // perform the join
                    if (Array.isArray(joinProperty)) { // join property is an array of ids
                        document[join.joinAs] = collection.find({_id: {$in: joinProperty}}).fetch();
                    } else { // join property is a single id
                        document[join.joinAs] = collection.findOne({_id: joinProperty});
                    }
                }

            });

        }

        const data = {
            currentUser: Meteor.user()
        };

        //const relatedIds = document.relatedIds;
        data[this.props.documentPropName] = document;

        return data;
    }

    render() {
        let showLoading = true;
        if (this.data[this.props.documentPropName]) {
            if (!!this.props.serverTag) {
                if (this.data[this.props.documentPropName][this.props.serverTag]) {
                    showLoading = false;
                }
            } else {
                showLoading = false;
            }
        }
        if (!showLoading) {
            if (this.props.component) {
                const Component = this.props.component;
                return <Component {...this.props.componentProps} {...this.data} collection={this.props.collection}/>;
            } else {
                return React.cloneElement(this.props.children, {...this.props.componentProps, ...this.data, collection: this.props.collection});
            }
        } else {
            return (
              <div className="placeholder_1WOC3">
                  <div className="loader_54XfI animationRotate loader_OEQVm">
                  </div>
              </div>
            )
        }
    }

}

PostDocumentContainer.contextTypes = {
    messages: React.PropTypes.object
};

PostDocumentContainer.propTypes = {
    collection: React.PropTypes.object.isRequired,
    selector: React.PropTypes.object.isRequired,
    publication: React.PropTypes.string,
    terms: React.PropTypes.any,
    joins: React.PropTypes.array,
    loading: React.PropTypes.func,
    component: React.PropTypes.func,
    componentProps: React.PropTypes.object,
    serverTag: React.PropTypes.string,
    documentPropName: React.PropTypes.string,
    cacheSubscription: React.PropTypes.bool
};

ReactMixin(PostDocumentContainer.prototype, ReactMeteorData);

PostDocumentContainer.defaultProps = {
    documentPropName: "document",
    cacheSubscription: false
};

module.exports = PostDocumentContainer;
export default PostDocumentContainer;