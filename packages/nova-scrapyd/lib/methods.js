import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

Meteor.methods({

    'politicl.scrapyd.logger': function () {

        //let extractBase = "http://localhost:6800/listjobs.json?project=myproject";
        let extractBase = "http://139.59.15.125:6800/listjobs.json";
        let result = Meteor.http.get(extractBase, {
            params: {
                project: "cwpoliticl"
            }
        });
        let tasks = result.data.finished;

        let counts = _.countBy(tasks, 'spider');

        let lists = _.chain(tasks).groupBy(function (element, index) {
            return element.spider == "politicl";
        }).toArray().value();

        return {"items": lists[0], "watch": lists[1], counts: counts};
    },

});
