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
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//mongo models
var SlackMessage = require('./models/slack_messages.js').make(Schema, mongoose);

//express
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//middleware body-parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );


//mount da routes
app.use('/', require('./controllers/index.js'));
app.use('/save_slack_message_webhook', require('./controllers/save_slack_messages_webhook.js'));


//default path
//app.get('/', function(request, response) {
//  response.send("<div style='font-size: 78px;'>superfly in the house.<br/>eating a mouse.<br/>bill bellamy escorts a llama to court in his lambo.<br/>but whose lambo is it?<br/>also, break tags.</div>")
//});

//slack sending stuff to this app
//app.post('/save_slack_message_webhook', function(request,response) {
//
//    var reply = slack_in.respond(request.body,function(hook) {
//        if (hook.user_name != 'slackbot'){
//
//            var slack_message = new SlackMessage ({
//                datetime: new Date(),
//                channel_name: hook.channel_name,
//                channel_id: hook.channel_id,
//                user_name: hook.user_name,
//                user_id: hook.user_id,
//                token: hook.token,
//                text: hook.text
//            });
//            slack_message.save(function (err) {if (err) console.log ('Error on save!' + err)});
//
//            return {
//                text: 'booyah, @' + hook.user_name + ' you are so correct old sport',
//                username: 'Superfly'
//            };
//        }
//
//    });
//
//    response.json(reply);
//
//});

//light it up
app.listen(app.get('port'), function() {
    console.log("Node app is running at port:" + app.get('port'))
});
