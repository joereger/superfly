exports.slack = require("./conf/slack.js");
exports.mongo = require("./conf/mongo.js");
exports.moment = require('moment');
exports.async = require('async');
exports.Map = require("collections/map"); //collectionsjs.com

exports.keys_sorted_by_vals = function(hashmap){

    var tuples = [];
    hashmap.forEach(function(value, key) {
        tuples.push([key, value]);
    });
    //console.log('tuples: '+tuples);

    tuples.sort(function(a, b) {
        a = a[1];
        b = b[1];
        return a < b ? -1 : (a > b ? 1 : 0);
    });

    var out = [];
    for (var i = 0; i < tuples.length; i++) {
        var key = tuples[i][0];
        var value = tuples[i][1];
        out.push(key);
    }

    return out;
}


