//node-slack config... using two separate webhook integrations on the Slack side (all dead keys)
var token_inbound_from_slack_general = 'T2kiFFhCfuaYSfNgIteabbs8';
var token_inbound_from_slack_devs = 'mX7D1P6cFvNcUWRyIlE75Ytl';
var token_inbound_from_slack_coaching = 'NdVDvdc5jfn1RAku16Mokqks';
var token_inbound_from_slack_test = '6W0pZXU2MzPloyGEUONfkIZ3';
var token_outbound_to_slack_test = 'g6sDbTj7WLjD8cK2AcOTHS5h';
var token_outbound_to_slack_superfly = 'SFTwREaQ4HHkYPYtLVaZtzQg';
var domain = 'springbot';
var Slack = require('node-slack');
exports.slack_in_general = new Slack(domain, token_inbound_from_slack_general);
exports.slack_in_devs = new Slack(domain, token_inbound_from_slack_devs);
exports.slack_in_coaching = new Slack(domain, token_inbound_from_slack_coaching);
exports.slack_in_test = new Slack(domain, token_inbound_from_slack_test);
exports.slack_out_test = new Slack(domain, token_outbound_to_slack_test);
exports.slack_out_superfly = new Slack(domain, token_outbound_to_slack_superfly);
