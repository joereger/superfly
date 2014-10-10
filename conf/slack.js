//node-slack config... using two separate webhook integrations on the Slack side
var token_inbound_from_slack = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_outbound_to_slack = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var domain = 'springbot';
var Slack = require('node-slack');
exports.slack_in = new Slack(domain, token_inbound_from_slack);
exports.slack_out = new Slack(domain, token_outbound_to_slack);