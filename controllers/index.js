var express  = require('express');
var router   = express.Router();

var all_bg_tasks = require('../background/includes_all_bg.js');

router.get('/', function(req, res) {



    //hack to make local testing easier
    if (req.query.password == 'superfly'){

        var start_date =  common.one_hour_ago();
        var end_date = new Date()
        console.log('start_date: '+start_date+' end_date: '+end_date);

        all_bg_tasks.top_slackers.run(start_date, end_date);
        res.send("<div style='font-size: 78px;'>superfly in the house.<br/>just ran bg task.</div>");

//        common.async.series([
//            function(callback){
//                all_bg_tasks.top_slackers.run(start_date, end_date);
//                callback(null, 'one');
//            },
//            function(callback){
//                res.send("<div style='font-size: 78px;'>superfly in the house.<br/>just ran bg task.</div>");
//                callback(null, 'two');
//            }
//        ]);

    } else {
        res.send("<div style='font-size: 78px;'>superfly in the house.<br/>eating a mouse.<br/>bill bellamy escorts a llama to court in his lambo.<br/>but whose lambo is it?<br/>also, break tags.</div>");
    }

});

module.exports = router;