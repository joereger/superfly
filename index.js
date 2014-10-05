
//node-slack config... using two webhook integrations on Slack side
var token_inbound_from_slack = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_outbound_to_slack = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var domain = 'springbot';
var Slack = require('node-slack');
var slack_in = new Slack(domain, token_inbound_from_slack);
var slack_out = new Slack(domain, token_outbound_to_slack);

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
