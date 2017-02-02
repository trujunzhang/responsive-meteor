"use strict";

let chai = require("chai");
let expect = chai.expect;

chai.config.includeStack = true;

describe("limitChildNode", function () {

    it("limit only 3 nodes(first have no children)", function () {

        const titles = {
            link: "Link",
            title: "Title",
            body: "Description",
            categories: "Categories",
            topics: "Topics",
            status: "Status",
            thumbnail: "Featured Image",
            gallery: "Gallery"
        };
        let s = 'gallery';
        const title = titles[s];
        expect(title).to.eql("Gallery");
    });

});
