var express  = require('express');
var router   = express.Router();

//node-slack config... using two separate webhook integrations on the Slack side
var token_inbound_from_slack = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_outbound_to_slack = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var domain = 'springbot';
var Slack = require('node-slack');
var slack_in = new Slack(domain, token_inbound_from_slack);
var slack_out = new Slack(domain, token_outbound_to_slack);

router.post('/', function(req, res) {

    var reply = slack_in.respond(req.body,function(hook) {
        if (hook.user_name != 'slackbot'){

            var slack_message = new SlackMessage ({
                datetime: new Date(),
                channel_name: hook.channel_name,
                channel_id: hook.channel_id,
                user_name: hook.user_name,
                user_id: hook.user_id,
                token: hook.token,
                text: hook.text
            });
            slack_message.save(function (err) {if (err) console.log ('Error on save!' + err)});

            return {
                text: 'booyah, @' + hook.user_name + ' you are so correct old sport',
                username: 'Superfly'
            };
        }

    });

    res.json(reply);

});

module.exports = router;