var express = require('express');
var router = express.Router();

var classRetriever = require('../web_scraping/webScrape.js');

courses = {
  "cs290": {
    "001": {
      "days": "mwf",
      "time": "3:00pm",
      "instructor": "Hess, Rob",
      "crn": "23049",
      "location": "LInC 210"
    }
  },
  "agri402": {
    "001": {
      "days": "tr",
      "time": "9:00am",
      "instructor": "Gaebel, K.",
      "crn": "73008",
      "location": "ALS 0008"
    }
  }
};
router.get('/:subject_code/:course_code', function(req, res, next) {
  var requestedCourse = req.params.subject_code.toLowerCase() + req.params.course_code.toLowerCase();
  // var out = classRetriever.getClassJSON(req.params.subject_code.toLowerCase(), req.params.course_code.toLowerCase());
  var subjectCode = req.params.subject_code.toLowerCase();
  var courseNum = req.params.course_code.toLowerCase();

  var PythonShell = require('python-shell');
  var fs = require('fs');
    var options = {
        mode: "text",
        args: [subjectCode, courseNum, 'W18']
    };
    var parsedData = "Test pls ignore";
    PythonShell.run('web_scraping/soup_attempt.py', options, function(results){
        fs.readFile('web_scraping/data/'+subjectCode+courseNum+"_W18.json", 'utf8', function (err, data) {
            if (err) {
              res.statusCode = 404;
              // res.header("Content-Type", 'application/json');
              res.send("Course not found");
            }
            else {
              parsedData = JSON.parse(data);
              //console.log(JSON.stringify(parsedData));
              res.header("Content-Type", 'application/json');
              res.send(JSON.stringify(parsedData, null, 2));
            }
        });
    });  
});

module.exports = router;