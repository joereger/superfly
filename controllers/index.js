var express  = require('express');
var router   = express.Router();

var all_bg_tasks = require('../background/includes_all_bg.js');

router.get('/', function(req, res) {

    //hack to make local testing easier
    if (req.query.password == 'superfly'){

        var start_date =  common.moment().startOf('week').toDate();
        var end_date = new Date();

        all_bg_tasks.sentiment_good.run(start_date, end_date, 'since the start of the week');


//        var associativeArray = new Array();
//        associativeArray['city'] = 8;
//        associativeArray['state'] = 3;
//        associativeArray['country'] = -1;
//        console.log(associativeArray);
//        associativeArray.sort(function(a, b) {
//            a = a[1];
//            b = b[1];
//            return a < b ? -1 : (a > b ? 1 : 0);
//        });
//        console.log(associativeArray);


//        console.log('moment()='+common.moment().format());
//        console.log('moment().startOfDay(\'\')='+common.moment().startOf('day').format());
//        console.log('moment().startOf(\'day\').toDate()='+common.moment().startOf('day').toDate());
//



        //secret response
        res.send("<div style='font-size: 78px;'>the superfly eats purple diamond croissants for brunch</div>");



    } else {
        //standard homepage response
        res.send("<div style='font-size: 78px;'>superfly in the house.<br/>eating a mouse.<br/>bill bellamy escorts a llama to court in his lambo.<br/>but whose lambo is it?<br/>also, break tags.</div>");
    }

});

module.exports = router;