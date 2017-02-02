import React, {PropTypes, Component} from 'react';

class FlashCollection {

    constructor() {
        // Local (client-only) collection
        this.collection = new Meteor.Collection(null);
    }

    flash(content, type) {
        type = (typeof type === 'undefined') ? 'error' : type;
        // Store errors in the local collection
        this.collection.insert({content: content, type: type, seen: false, show: true});
    }

    markAsSeen(messageId) {
        this.collection.update(messageId, {$set: {seen: true}});
    }

    clear(messageId) {
        this.collection.update(messageId, {$set: {show: false}});
    }

    clearSeen() {
        this.collection.update({seen: true}, {$set: {show: false}}, {multi: true});
    }

    getFlashCollection() {
        return this.collection;
    }

}

export default FlashCollection;
