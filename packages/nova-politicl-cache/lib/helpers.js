import Telescope from 'meteor/nova:lib';
import PoliticlCaches from './collection.js';

import moment from 'moment';

let md5 = require('blueimp-md5');

PoliticlCaches.helpers({getCollection: () => PoliticlCaches});
PoliticlCaches.helpers({getCollectionName: () => "politiclCaches"});

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Get a topic's counter name
 * @param {Object} topic
 */
PoliticlCaches.getCounterName = function (topic) {
    return topic._id + "-postsCount";
};
PoliticlCaches.helpers({
    getCounterName: function () {
        return PoliticlCaches.getCounterName(this);
    }
});

PoliticlCaches.getCounterKeyName = function () {
    return "postsCount";
};
PoliticlCaches.helpers({
    getCounterKeyName: function () {
        return PoliticlCaches.getCounterKeyName(this);
    }
});

PoliticlCaches.filterTopics = function (topicsFilterKeys, name) {
    let keys = topicsFilterKeys.trim().split(',');
    for (let i = 0; i < keys.length; i++) {
        if (name.indexOf(keys[i]) !== -1) {
            return true;
        }
    }
    return false;
};
PoliticlCaches.helpers({
    filterTopics: function () {
        return PoliticlCaches.filterTopics(this);
    }
});

PoliticlCaches.getTopicStatus = (topic, state) => {
    let statusArray = [];
    let topicStatus = PoliticlCaches.config.STATUS_TITLES[topic.status];
    if (state.toLowerCase() != topicStatus.toLowerCase()) {
        if (topic.status != PoliticlCaches.config.STATUS_APPROVED) {
            statusArray.push(topicStatus);
        }
    }
    if (!!topic.is_ignore && (state.toLowerCase() != PoliticlCaches.config.STATUS_TITLES[PoliticlCaches.config.STATUS_FILTER].toLowerCase())) {
        statusArray.push(PoliticlCaches.config.STATUS_TITLES[PoliticlCaches.config.STATUS_FILTER]);
    }

    return statusArray;
};

PoliticlCaches.helpers({
    getTopicStatus: function () {
        return PoliticlCaches.getTopicStatus(this);
    }
});

PoliticlCaches.getTotalCount = (props, status) => {
    let count = 0;
    //switch (status) {
    //    case "publish":
    //        count = props.publishCount;
    //        break;
    //    case "filter":
    //        count = props.filterCount;
    //        break;
    //    case "trash":
    //        count = props.trashCount;
    //        break;
    //    default:
    //        count = props.allCount;
    //        break;
    //}

    return count;
};

PoliticlCaches.helpers({
    getTotalCount: function () {
        return PoliticlCaches.getTotalCount(this);
    }
});


/**
 * @summary generate 15 days as the day filter for posts list admin
 */
PoliticlCaches.getDateSelectors = function () {
    const size = 15;
    let REFERENCE = moment(new Date()); // today
    let currentYear = REFERENCE.format("YYYY");

    const dateSelectors = [];
    for (i = 0; i < size; i++) {
        const date = REFERENCE.clone().subtract(i, 'months');
        const queryString = moment(date).format("YYYY-MM");
        const year = moment(date).format("YYYY");
        if (currentYear !== year) {
            break;
        }

        const title = date.format("MMMM YYYY");
        dateSelectors.push({"query": queryString, "title": title})
    }

    return dateSelectors;
};
PoliticlCaches.helpers({
    getDateSelectors: function () {
        return PoliticlCaches.getDateSelectors(this);
    }
});
