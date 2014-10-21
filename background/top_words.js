
var sf_ = require('../includes_sf_.js');
var Tokenizer = require('sentence-tokenizer');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var word_counts = new sf_.Map();
    var number_of_messages = 0;

    sf_.async.series([
        function(callback){
            console.log('step 1');

            sf_.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
                if (err) return console.log(err);
                console.log('step 1: inside mongo result query');
                number_of_messages = slack_messages.length;
                slack_messages.forEach( function ( slack_message ) {

                    if (slack_message.text) {

                        var tokenizer = new Tokenizer('');
                        tokenizer.setEntry(slack_message.text);
                        var sentences = tokenizer.getSentences(); //must run before getTokens()
                        var words = tokenizer.getTokens();

                        words.forEach(function (word) {

                            if (word_counts.has(word)) {
                                var current_value = word_counts.get(word);
                                var new_value = current_value + 1;
                                word_counts.set(word, new_value);
                            } else {
                                word_counts.set(word, 1);
                            }

                        });
                    }

                } );
                callback(null, 'one');
            } );

        },
        function(callback){
            var msg = '*top 10 words used '+time_period_phrasing+'*\n';

            var keys_sorted_by_val = sf_.keys_sorted_by_vals(word_counts);

            var count = 0;
            keys_sorted_by_val.forEach(function(key) {
                if (count<10) {
                    if (key.indexOf("http") == -1 && key.indexOf("@") == -1) {
                        msg += '\n' + key + ': ' + word_counts.get(key) + ' times';
                        count++;
                    }
                }
            });

            sf_.slack.slack_out.send({
                text: msg,
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
