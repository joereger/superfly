
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
                var mood = 'neutral';
                var score = sentiment_by_slacker.get(key);

                if (score >= 15){
                    mood = 'basically george clooney and emma watson playing with puppies';
                } else if (score >= 10 && score < 15){
                    mood = 'a luminous conflagration of positive energy'
                } else if (score >= 7 && score < 10){
                    mood = 'glowing fucking positivity'
                } else if (score >= 5 && score < 7){
                    mood = 'really damn positive'
                } else if (score >= 2 && score < 5){
                    mood = 'positive'
                } else if (score > 0 && score < 2){
                    mood = 'kinda positive'
                } else if (score < 0 && score >= -2){
                    mood = 'kinda negative'
                } else if (score < 0 && score >= -2){
                    mood = 'negative'
                } else if (score < -2 && score >= -5){
                    mood = 'really damn negative'
                } else if (score < -5 && score >= -7){
                    mood = 'fiery pissed-offedness'
                } else if (score < -7 && score >= -10){
                    mood = 'a walking shitstorm of vile verbal excretions'
                } else if (score < -10 && score >= -5000000){
                    mood = 'basically henry rollins and lewis black drunk talking shit about justin bieber'
                } else {
                    mood = 'neutral';
                }

                var plus_sign = '';
                if (score>0){
                    plus_sign = '+';
                }

                msg += '\n\n*'+key+'\'s mood*: '+mood+'\n   sentiment score['+plus_sign+''+sentiment_by_slacker.get(key)+']\n   positive words[ '+positive_words.get(key)+' ]\n   negative words[ '+negative_words.get(key)+' ]';
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
