"use strict";

let chai = require("chai");
let expect = chai.expect;

chai.config.includeStack = true;

let Helper = {};

Helper.getCurrentChildrenCount = function (comment) {
    let size = 0;
    let children = comment.childrenResults;
    while (!!children) {

    }

    return size;
};

describe("limitChildNode", function () {

    it("limit only 3 nodes(first have no children)", function () {
        let array = [
            {_id: 1},
            {_id: 2, childrenResults: [{_id: 21}, {_id: 22}]},
            {_id: 3, childrenResults: [{_id: 31}, {_id: 32, childrenResults: {_id: 321}}]},
        ];

        //let string = JSON.stringify(array);
        let childrenSize = Helper.getCurrentChildrenCount(array[0]);
        let result = expect(0).to.eql(childrenSize);
        childrenSize = Helper.getCurrentChildrenCount(array[1]);
        result = expect(2).to.eql(childrenSize);
        childrenSize = Helper.getCurrentChildrenCount(array[2]);
        result = expect(3).to.eql(childrenSize);
    });

    //it("limit only 3 nodes(first have 1 children)", function () {
    //    let array = [
    //        {_id: 1, childrenResults: [{_id: 11}]},
    //        {_id: 2, childrenResults: [{_id: 21}, {_id: 22}]},
    //        {_id: 3, childrenResults: [{_id: 31}, {_id: 32}]},
    //    ];
    //    let limitedArray = Helper.limitedResult(array, 3);
    //    let result = expect(3).to.eql(Helper.getAllNodes(limitedArray, 3));
    //});

});
