import React from 'react';
import Messages from "../messages.js";

import {createContainer} from 'meteor/react-meteor-data';

const PopupPostsContainer = createContainer(() => {
    return {
        posts: Messages.getPostsCollection().find({show:true}).fetch()
    }
}, params => <params.component {...params} />);

PopupPostsContainer.displayName = "PopupPostsContainer";

module.exports = PopupPostsContainer;
export default PopupPostsContainer;
