var express = require('express');
var router = express.Router();

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
  var subjectCode = req.params.subject_code.toLowerCase();
  var courseNum = req.params.course_code.toLowerCase();

  var fs = require('fs');
    var exec = require('child_process').exec;
    exec('python3 web_scraping/soup_attempt.py ' + subjectCode + ' ' + courseNum + ' W18', function(err, stdout, stderr) {
      console.log(stdout);
        fs.readFile('web_scraping/data/'+subjectCode.toUpperCase()+courseNum+"_W18.json", 'utf8', function (err, data) {
            if (err) {
              res.statusCode = 404;
              res.header("Content-Type", 'text/plain');
              res.send("Course not found");
            }
            else {
              res.statusCode = 200;
              parsedData = JSON.parse(data);
              res.header("Content-Type", 'application/json');
              res.send(JSON.stringify(parsedData, null, 2));
            }
        });
    });
});

module.exports = router;
