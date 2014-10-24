//node-slack config... using two separate webhook integrations on the Slack side
var token_inbound_from_slack_general = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_outbound_to_slack_test = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var token_outbound_to_slack_superfly = 'vdsdsfsdf';
var domain = 'springbot';
var Slack = require('node-slack');
exports.slack_in_general = new Slack(domain, token_inbound_from_slack_general);
exports.slack_out_test = new Slack(domain, token_outbound_to_slack_test);
exports.slack_out_superfly = new Slack(domain, token_outbound_to_slack_superfly);