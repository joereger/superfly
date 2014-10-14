
var common = require('../includes_common.js');

exports.run = function(start_date, end_date, time_period_phrasing){

    var count = 0;
    common.async.series([
        function(callback){
            console.log('about to run the count');
            common.mongo.SlackMessage.count({datetime: {'$gte': start_date, '$lte': end_date}}, function(err, result){
                if (err) return console.log(err);
                console.log( "step 1 result = ", result );
                count = result;
                callback(null, 'one');
            });
        },
        function(callback){
            console.log('step 2 count = '+count);
            common.slack.slack_out.send({
                text: count + ' slacks '+time_period_phrasing,
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
