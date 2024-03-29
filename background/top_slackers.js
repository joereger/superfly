
var sf_ = require('../includes_sf_.js');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var slackers = new sf_.Map();
    var number_of_messages = 0;

    sf_.async.series([
        function(callback){
            //iterate all slack_messages in the date period
            sf_.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
                if (err) return console.log(err);
                number_of_messages = slack_messages.length;
                slack_messages.forEach( function ( slack_message ) {

                    //build array of who posted and increment each one
                    if (slackers.has(slack_message.user_name)){
                        var current_value = slackers.get(slack_message.user_name);
                        var new_value = current_value + 1;
                        slackers.set(slack_message.user_name, new_value);
                    } else {
                        slackers.set(slack_message.user_name, 1);
                    }

                } );
                callback(null, 'one');
            } );

        },
        function(callback){
            var msg = '*top slackers '+time_period_phrasing+'*\n';

            var keys_sorted_by_val = sf_.keys_sorted_by_vals(slackers);

            keys_sorted_by_val.forEach(function(key) {
                msg += '\n'+key+': '+slackers.get(key)+' slacks';
            });

            sf_.slack.slack_out_test.send({
                text: msg,
                channel: '#test',
                username: 'Superfly'
            });
            callback(null, 'two');
        }
    ]);

}
