exports.slack = require("./conf/slack.js");
exports.mongo = require("./conf/mongo.js");
exports.moment = require('moment');
exports.async = require('async');


var MS_PER_MINUTE = 60000;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_DAY = 24 * MS_PER_HOUR;

exports.one_hour_ago = function(){
    var one_hour_ago = new Date(new Date() - MS_PER_HOUR);
    console.log('now: '+new Date()+' one_hour_ago: '+one_hour_ago);
    return one_hour_ago;
}

exports.one_day_ago = function(){
    var one_day_ago = new Date(new Date() - MS_PER_DAY);
    console.log('now: '+new Date()+' one_day_ago: '+one_day_ago);
    return one_day_ago;
}
