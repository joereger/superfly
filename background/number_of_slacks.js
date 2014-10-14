
var common = require('../includes_common.js');

exports.run = function(start_date, end_date, time_period_phrasing){

    var count = 0;
    common.async.series([
        function(callback){
            common.mongo.SlackMessage.count({datetime: {'$gte': start_date, '$lte': end_date}}, function(err, result){
                if (err) return console.log(err);
                count = result;
                callback(null, 'one');
            });
        },
        function(callback){
            common.slack.slack_out.send({
                text: count + ' slacks '+time_period_phrasing,
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
