"use strict";

let chai = require("chai");
let expect = chai.expect;

chai.config.includeStack = true;

describe("collect base javascript methods", function () {

    it("How do I make the first letter of a string uppercase in JavaScript?", function () {
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    });

    it("Joining javascript key-value objects as string.", function () {

        Object.prototype.join = function (glue, separator) {
            var object = this;

            if (glue == undefined)
                glue = '=';

            if (separator == undefined)
                separator = ',';

            return $.map(Object.getOwnPropertyNames(object), function (k) {
                return [k, object[k]].join(glue)
            }).join(separator);
        };

        var options = {id: 1, name: 'lucas', country: 'brasil'};

        //let result = _.map(options.getOwnPropertyNames(object), function (k) {
        //    return [k, object[k]].join('=')
        //}).join('&');

        let result = options.join();
        //> "id=1,name=lucas,country=brasil"

        let result1 = options.join('=>', ' ');
        //> "id=>1 name=>lucas country=>brasil"
    });

});
