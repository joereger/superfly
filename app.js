
//express
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//middleware body-parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

//mongo object
mongo = require("./conf/mongo.js");

//mount the routes
app.use('/', require('./controllers/index.js'));
app.use('/save_slack_message_webhook', require('./controllers/save_slack_messages_webhook.js'));

//light it up
app.listen(app.get('port'), function() {
    console.log("Superfly is running at port:" + app.get('port'))
});
