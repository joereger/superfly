
var common = require('../includes_common.js');

exports.run = function(start_date, end_date, time_period_phrasing){

    //set up a hashmap to store values
    var slackers = new common.hashmap();
    var number_of_messages = 0;

    common.async.series([
        function(callback){
            //iterate all slack_messages in the date period
            common.mongo.SlackMessage.find({datetime: {'$gte': start_date, '$lte': end_date}}, function ( err, slack_messages ) {
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

            slackers.forEach(function(value, key) {
                msg += '\n'+key+': '+value+' slacks';
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
