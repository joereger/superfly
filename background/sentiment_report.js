
var sf_ = require('../includes_sf_.js');
var sentiment = require('sentiment');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up maps to store values
    var catted_slacks_by_slacker = new sf_.Map();
    var sentiment_by_slacker = new sf_.Map();
    var comparative_by_slacker = new sf_.Map();
    var positive_words = new sf_.Map();
    var negative_words = new sf_.Map();

    //make these async's serial
    sf_.async.series([
        function(callback){

            sf_.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
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

            var msg = '*sentiment summary '+time_period_phrasing+'* #general, #devs and #coaching\n';

            var keys_sorted_by_sentiment = sf_.keys_sorted_by_vals(sentiment_by_slacker);

            keys_sorted_by_sentiment.forEach(function(key) {
                var mood = 'neutral';
                var score = sentiment_by_slacker.get(key);


                if (score >= 30){
                    mood = 'prossibly a superfly cheat who is in reality crazy pissed off at the universe';
                } else if (score >= 20 && score < 30){
                    mood = 'a luminous conflagration of positive energy'
                } else if (score >= 10 && score < 15){
                    mood = 'walking on a cloud of positive vibes'
                } else if (score >= 7 && score < 10){
                    mood = 'glowing fucking positivity'
                } else if (score >= 5 && score < 7){
                    mood = 'really damn positive'
                } else if (score >= 2 && score < 5){
                    mood = 'generally positive'
                } else if (score > 0 && score < 2){
                    mood = 'just positive enough to not be negative'
                } else if (score < 0 && score >= -2){
                    mood = 'just negative enough to not be positive'
                } else if (score < 0 && score >= -2){
                    mood = 'generally negative'
                } else if (score < -2 && score >= -5){
                    mood = 'really damn negative'
                } else if (score < -5 && score >= -7){
                    mood = 'fiery pissed-offedness'
                } else if (score < -7 && score >= -10){
                    mood = 'conflagration of pissed-offedness'
                } else if (score < -10 && score >= -15){
                    mood = 'tactical thermonuclear slack-based war monger'
                } else if (score < -15 && score >= -30){
                    mood = 'a walking shitstorm of vile verbal excretions'
                } else if (score < -30 && score >= -5000000){
                    mood = 'prossibly a superfly cheat who is in reality very happy and zen-like'
                } else {
                    mood = 'neutral';
                }

                var plus_sign = '';
                if (score>0){
                    plus_sign = '+';
                }

                msg += '\n\n*'+key+'\'s mood*: '+mood+'\n   sentiment score['+plus_sign+''+sentiment_by_slacker.get(key)+']\n   positive words[ '+positive_words.get(key)+' ]\n   negative words[ '+negative_words.get(key)+' ]';

            });


            sf_.slack.slack_out_superfly.send({
                text: msg,
                channel: '#superfly',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
