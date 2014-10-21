
var sf_ = require('../includes_sf_.js');

exports.run = function(start_date, end_date, time_period_phrasing){

    var count = 0;
    sf_.async.series([
        function(callback){
            sf_.mongo.SlackMessage.count({datetime: {'$gte': start_date, '$lte': end_date}}, function(err, result){
                if (err) return console.log(err);
                count = result;
                callback(null, 'one');
            });
        },
        function(callback){
            sf_.slack.slack_out.send({
                text: '*'+count + ' slacks '+time_period_phrasing+'*',
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
