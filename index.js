var token = 'T2kiFFhCfuaYSfNgIteabbs8';
var domain = 'springbot';
var Slack = require('node-slack');
var slack = new Slack(domain, token);

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response) {
  response.send('Hello Superfly!')
});

app.post('/test-webhook', function(request,response) {


    if (request.body != null){
        console.log('Request.body: ' + request.body);
        console.log('Request.body.token: ' + request.body.token);
        console.log('Request.body.user_name: ' + request.body.user_name);
    } else {
        console.log('Request.body: null');
    }


    if (request.query != null){
        console.log('Request.query: ' + request.query);
        console.log('Request.query.token: ' + request.query.token);
        console.log('Request.query.user_name: ' + request.query.user_name);
    } else {
        console.log('Request.query: null');
    }


    var reply = slack.respond(request.body,function(hook) {

        return {
            text: 'Booyah, ' + hook.user_name,
            username: 'Superfly'
        };

    });

    console.log('Response.body: '+response.body);

    response.json(reply);

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
});
