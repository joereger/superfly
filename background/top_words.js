
var common = require('../includes_common.js');
var Tokenizer = require('sentence-tokenizer');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var word_counts = new common.hashmap();
    var number_of_messages = 0;

    common.async.series([
        function(callback){
            console.log('step 1');

            common.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
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
                console.log('step 1: words.count()='+word_counts.count());
                callback(null, 'one');
            } );

        },
        function(callback){
            console.log('step 2');

            var msg = 'top words used '+time_period_phrasing+'\n';

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
