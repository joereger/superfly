var express  = require('express');
var router   = express.Router();

var all_bg_tasks = require('../background/includes_all_bg.js');

router.get('/', function(req, res) {

    //hack to make local testing easier
    if (req.query.password == 'superfly'){



        //secret response
        res.send("<div style='font-size: 78px;'>the superfly eats purple diamond croissants for brunch</div>");


    } else {
        //standard homepage response
        res.send("<div style='font-size: 78px;'>superfly in the house.<br/>eating a mouse.<br/>bill bellamy escorts a llama to court in his lambo.<br/>but whose lambo is it?<br/>also, break tags.</div>");
    }

});

module.exports = router;