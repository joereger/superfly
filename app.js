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
SlackMessage = require('./models/slack_messages.js').make(Schema, mongoose);

//express
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//middleware body-parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

//mount the routes
app.use('/', require('./controllers/index.js'));
app.use('/save_slack_message_webhook', require('./controllers/save_slack_messages_webhook.js'));

//light it up
app.listen(app.get('port'), function() {
    console.log("Node app is running at port:" + app.get('port'))
});
