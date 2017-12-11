var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu" //process.env.MONGO_HOST;         
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = "cs290_gillens" //process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = "cs290_gillens" //process.env.MONGO_DB;

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
// console.log(mongoURL);

var mongoConnection = null;

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
router.get('/:subject_code/:course_code', function (req, res, next) {
  var requestedCourse = req.params.subject_code.toUpperCase() + req.params.course_code.toUpperCase();
  var subjectCode = req.params.subject_code.toUpperCase();
  var courseNum = req.params.course_code.toUpperCase();

  var fs = require('fs');
  var exec = require('child_process').exec;



  var classDataCollection = mongoConnection.collection('classesData');
  console.log("trying to find ", requestedCourse, " in mongo database");
  classDataCollection.find({ course: requestedCourse }).toArray(function (err, results) {
    var hoursBetween = 0;
    if (err) {
      res.status(500).send("Error fetching class from DB");
    } else if (results.length > 0) {
      //date checking
      var withinOneDay = true;
      var now = new Date();
      var retrievalDate = Date.parse(results[0]["time_retrieved"]);

      var hoursBetween = 0; //((now - retrievalDate) / 1000 / 3600);
      console.log("== Difference between current date and retrieval:", hoursBetween, "hours");
      if (hoursBetween < 24) {
        results[0]["time_retrieved"]
        res.statusCode = 200;
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(results[0], null, 2));
      }
    }
    if (hoursBetween > 24 || results.length == 0) {
      exec('python web_scraping/soup_attempt.py ' + subjectCode + ' ' + courseNum + ' W18', function (err, stdout, stderr) {
        console.log("== Searching Ed's files for you class data... ", stdout);
        fs.readFile('web_scraping/data/' + subjectCode + courseNum + "_W18.json", 'utf8', function (err, data) {
          if (err) {
            console.log("== Looks like Ed doesn't have data on this one");
            res.statusCode = 404;
            res.header("Content-Type", 'text/plain');
            res.send("Course not found");
          }
          else {
            console.log("== Found it");
            res.statusCode = 200;
            parsedData = JSON.parse(data);

            var classDataCollection = mongoConnection.collection('classesData');
            classDataCollection.insert(parsedData);

            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(parsedData, null, 2));
          }
        });
      });
    }
  });
});

MongoClient.connect(mongoURL, function (err, connection) {
  if (err) {
    throw err;
  }
  mongoConnection = connection;
  console.log("Established a connection to DB");
});


module.exports = router;
