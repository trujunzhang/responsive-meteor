import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import Folders from "meteor/nova:folders";
import {ListContainer, DocumentContainer} from "meteor/utilities:react-list-container";

class CollectionsList extends Component {

    render() {
        const terms = {
            userId: this.props.userId,
            listId:"user.folder.list",
            limit:10,
        };
        const {selector,options} = Folders.parameters.get(terms);

       return (
          <ListContainer
            collection={Folders}
            publication="folders.list"
            selector={selector}
            options={options}
            terms={terms}
            component={Telescope.components.CollectionsResult}
            componentProps={this.props}
            listId={terms.listId}
            limit={terms.limit}
          />
        )
    }
}

module.exports = CollectionsList;
export default CollectionsList;
