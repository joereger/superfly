
var sf_ = require('../includes_sf_.js');
var sentiment = require('sentiment');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up maps to store values
    var catted_slacks_by_slacker = new sf_.Map();
    var top_phrases_by_slacker = new sf_.Map();


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
                    console.log(key+': '+value);
                    var startWords = require('../node_modules/gramophone/stopwords.json');
                    startWords = [];
                    var g = sf_.gramophone.extract(value, {score: true, min: 2, ngrams: [3, 4, 5], startWords: startWords});
                    //top_phrases_by_slacker.set(key, g);
                    console.log(key+'-> '+g);
                });

                callback(null, 'one');
            } );

        },
        function(callback){
            console.log('into step 2');

//            var msg = '*top phrases used '+time_period_phrasing+'*\n';
//
//            top_phrases_by_slacker.forEach(function(key) {
//                var g = top_phrases_by_slacker.get(key);
//                msg += '\n\n*'+key+'\'s most used phrases*:  '+ g +']';
//
//            });
//
//            console.log('OUTPUT');
//            console.log(msg);



//            var msg = '*top phrases used '+time_period_phrasing+'*\n';
//
//            var keys_sorted_by_sentiment = sf_.keys_sorted_by_vals(sentiment_by_slacker);
//
//            keys_sorted_by_sentiment.forEach(function(key) {
//
//                msg += '\n\n*'+key+'\'s most used phrases*:  ]';
//
//            });
//
//
//            sf_.slack.slack_out_test.send({
//                text: msg,
//                channel: '#test',
//                username: 'Superfly'
//            });
            callback(null, 'two');
        }
    ]);

}
