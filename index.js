//node-slack config... using two separate webhook integrations on the Slack side
var token_inbound_from_slack = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_outbound_to_slack = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var domain = 'springbot';
var Slack = require('node-slack');
var slack_in = new Slack(domain, token_inbound_from_slack);
var slack_out = new Slack(domain, token_outbound_to_slack);

//mongo config and connect
var mongoose = require('mongoose');
var uristring = process.env.MONGOHQ_URL ||  'mongodb://localhost/superfly';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

//mongo schema: slack_messages
var slack_messages_schema = new mongoose.Schema({
        datetime: Date,
        channel_name: String,
        user_name: String,
        user_id: String,
        text: String
});

//mongo compile schema into model: slack_messages
var SlackMessage = mongoose.model('slack_messages', slack_messages_schema);


//express
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//middleware body-parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );


//default path
app.get('/', function(request, response) {
  response.send('Hello Superfly!')
});

//slack sending stuff to this app
app.post('/test-webhook', function(request,response) {

    var reply = slack_in.respond(request.body,function(hook) {
        if (hook.user_name != 'slackbot'){


            var slack_message = new SlackMessage ({
                datetime: new Date(),
                channel_name: hook.channel_name,
                user_name: hook.user_name,
                user_id: hook.user_id,
                text: hook.text
            });
            slack_message.save(function (err) {if (err) console.log ('Error on save!' + err)});

            return {
                text: 'Booyah, ' + hook.user_name,
                username: 'Superfly'
            };
        }

    });

    response.json(reply);

});

//light it up
app.listen(app.get('port'), function() {
    console.log("Node app is running at port:" + app.get('port'))
});
