
var common = require('../includes_common.js');
var sentiment = require('sentiment');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var catted_slacks_by_slacker = new common.hashmap();
    var sentiment_by_slacker = new common.hashmap();
    var comparative_by_slacker = new common.hashmap();
    var positive_words = new common.hashmap();
    var negative_words = new common.hashmap();

    common.async.series([
        function(callback){

            common.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
                if (err) return console.log(err);

                //Iterate to concatenate all of a user's messages
                slack_messages.forEach( function ( slack_message ) {

                    if (slack_message.text) {

                        //concatenate the messages of each slacker
                        if (catted_slacks_by_slacker.has(slack_message.user_name)){
                            var current_value = catted_slacks_by_slacker.get(slack_message.user_name);
                            var new_value = current_value + ' ' + slack_message.text;
                            catted_slacks_by_slacker.set(slack_message.user_name, new_value);
                        } else {
                            catted_slacks_by_slacker.set(slack_message.user_name, slack_message.text);
                        }

                    }
                } );

                catted_slacks_by_slacker.forEach(function(value, key) {
                    var result = sentiment(value);
                    sentiment_by_slacker.set(key, result.score);
                    comparative_by_slacker.set(key, result.comparative);
                    positive_words.set(key, result.positive);
                    negative_words.set(key, result.negative);
                });

                callback(null, 'one');
            } );

        },
        function(callback){

            var msg = '*sentiment summary '+time_period_phrasing+'*\n';

            catted_slacks_by_slacker.keys().sort().forEach(function(key) {
                msg += '\n'+key+' sentiment score: '+sentiment_by_slacker.get(key)+' positive['+positive_words.get(key)+'] negative['+negative_words.get(key)+']';
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
