////mongo config and connect
//var mongoose = require('mongoose');
//var uristring = process.env.MONGOHQ_URL ||  'mongodb://localhost/superfly';
//mongoose.connect(uristring, function (err, res) {
//    if (err) {
//        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//    } else {
//        console.log ('Succeeded connected to: ' + uristring);
//    }
//});
//var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;
//
////mongo models
//var SlackMessage = require('./models/slack_messages.js').make(Schema, mongoose);