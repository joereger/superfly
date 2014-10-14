
var common = require('../includes_common.js');
var sentiment = require('sentiment');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var word_counts = new common.hashmap();
    var number_of_messages = 0;

    common.async.series([
        function(callback){

            common.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
                if (err) return console.log(err);
                number_of_messages = slack_messages.length;
                slack_messages.forEach( function ( slack_message ) {

                    if (slack_message.text) {

                        var r1 = sentiment('Cats are stupid.');
                        console.dir(r1);

                    }

                } );
                callback(null, 'one');
            } );

        },
        function(callback){

            var msg = 'happiest individual '+time_period_phrasing+'\n';

            word_counts.forEach(function(value, key) {
                msg += '\n*'+key+':* '+value+' times';
            });

            common.slack.slack_out.send({
                text: msg,
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
