var express  = require('express');
var router   = express.Router();

router.get('/', function(req, res) {
    res.send("<div style='font-size: 78px;'>superfly in the house.<br/>eating a mouse.<br/>bill bellamy escorts a llama to court in his lambo.<br/>but whose lambo is it?<br/>also, break tags.</div>");
});

module.exports = router;