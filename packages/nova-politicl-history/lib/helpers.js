import Telescope from 'meteor/nova:lib';
import PoliticlHistory from './collection.js';

import moment from 'moment';

let md5 = require('blueimp-md5');

PoliticlHistory.helpers({getCollection: () => PoliticlHistory});
PoliticlHistory.helpers({getCollectionName: () => "politiclHistory"});

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Get a topic's counter name
 * @param {Object} topic
 */
PoliticlHistory.getCounterName = function (topic) {
    return topic._id + "-postsCount";
};
PoliticlHistory.helpers({
    getCounterName: function () {
        return PoliticlHistory.getCounterName(this);
    }
});

PoliticlHistory.getCounterKeyName = function () {
    return "postsCount";
};
PoliticlHistory.helpers({
    getCounterKeyName: function () {
        return PoliticlHistory.getCounterKeyName(this);
    }
});

PoliticlHistory.filterTopics = function (topicsFilterKeys, name) {
    let keys = topicsFilterKeys.trim().split(',');
    for (let i = 0; i < keys.length; i++) {
        if (name.indexOf(keys[i]) !== -1) {
            return true;
        }
    }
    return false;
};
PoliticlHistory.helpers({
    filterTopics: function () {
        return PoliticlHistory.filterTopics(this);
    }
});

PoliticlHistory.getTopicStatus = (topic, state) => {
    let statusArray = [];
    let topicStatus = PoliticlHistory.config.STATUS_TITLES[topic.status];
    if (state.toLowerCase() != topicStatus.toLowerCase()) {
        if (topic.status != PoliticlHistory.config.STATUS_APPROVED) {
            statusArray.push(topicStatus);
        }
    }
    if (!!topic.is_ignore && (state.toLowerCase() != PoliticlHistory.config.STATUS_TITLES[PoliticlHistory.config.STATUS_FILTER].toLowerCase())) {
        statusArray.push(PoliticlHistory.config.STATUS_TITLES[PoliticlHistory.config.STATUS_FILTER]);
    }

    return statusArray;
};

PoliticlHistory.helpers({
    getTopicStatus: function () {
        return PoliticlHistory.getTopicStatus(this);
    }
});

PoliticlHistory.getTotalCount = (props, status) => {
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

PoliticlHistory.helpers({
    getTotalCount: function () {
        return PoliticlHistory.getTotalCount(this);
    }
});


/**
 * @summary generate 15 days as the day filter for posts list admin
 */
PoliticlHistory.getDateSelectors = function () {
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
PoliticlHistory.helpers({
    getDateSelectors: function () {
        return PoliticlHistory.getDateSelectors(this);
    }
});
