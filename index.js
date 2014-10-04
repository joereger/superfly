var express = require('express')
var app = express();

var token = 'T2kiFFhCfuaYSfNgIteabbs8';
var domain = 'springbot.slack.com';
var Slack = require('node-slack');
var slack = new Slack(domain, token);

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello Superfly!')
})

app.post('/test-webhook',function(req,res) {

    console.log('Connection from: ' + req.connection.remoteAddress);

    var reply = slack.respond(req,function(hook) {

        return {
            text: 'Booyah, ' + hook.user_name,
            username: 'Superfly'
        };

    });

    res.json(reply);

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
})
