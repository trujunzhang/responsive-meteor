"use strict";

let chai = require("chai");
let expect = chai.expect;

let moment = require("moment");

chai.config.includeStack = true;

describe("parse-created-at", function () {

    //it("convert createdAt to string", function () {
    //    let createdAt = "2016-02-04T10:30:17.154Z";
    //    let moment2 = moment(createdAt);
    //    let format = moment2.format("YYYY-MM-DD-HH-mm-ss").split('-');
    //    let createdAtObject = {
    //        year: format[0],
    //        month: format[1],
    //        day: format[2],
    //        hour: format[3],
    //        minute: format[4],
    //        second: format[5]
    //    };
    //    expect(createdAtObject.year).to.eql("2016");
    //    expect(createdAtObject.month).to.eql("02");
    //    expect(createdAtObject.day).to.eql("04");
    //    expect(createdAtObject.minute).to.eql("30");
    //    expect(createdAtObject.second).to.eql("17");
    //});

    it("convert string to datetime", function () {
        let createdAtObject = {
            years: "2016",
            months: "12",
            date: "22",
            hours: "10",
            minutes: "88",
            seconds: "17"
        };
        let split = Object.values(createdAtObject);
        let string = split.join('-');

        let newDate = new Date();

        let createdAt = moment(string, "YYYY-MM-DD-HH-mm-ss");
        //let createdAt = moment(createdAtObject);
        //let date = createdAt.valueOf();
        let x = 0;

        let monthTemp = [
            {value: "01", title: "01-Jan"},
            {value: "02", title: "02-Feb"},
            {value: "03", title: "03-Mar"},
            {value: "04", title: "04-Apr"},
            {value: "05", title: "05-May"},
            {value: "06", title: "06-Jun"},
            {value: "07", title: "07-Jul"},
            {value: "08", title: "08-Aug"},
            {value: "09", title: "09-Sep"},
            {value: "10", title: "10-Oct"},
            {value: "11", title: "11-Nov"},
            {value: "12", title: "12-Dec"}
        ];
    });
});
