var express  = require('express');
var router   = express.Router();

router.post('/', function(req, res) {

    console.log('req.body.token='+req.body.token);

    var reply = sf_.slack.slack_in_general.respond(req.body,function(hook) {
        if (hook.user_name != 'slackbot'){

            var slack_message = new sf_.mongo.SlackMessage ({
                datetime: new Date(),
                channel_name: hook.channel_name,
                channel_id: hook.channel_id,
                user_name: hook.user_name,
                user_id: hook.user_id,
                token: hook.token,
                text: hook.text
            });
            slack_message.save(function (err) {if (err) console.log ('Error on save!' + err)});

            return{};

//            return {
//                text: 'booyah, @' + hook.user_name + ' you are so correct old sport',
//                username: 'Superfly'
//            };
        }

    });

    res.json(reply);

});

module.exports = router;