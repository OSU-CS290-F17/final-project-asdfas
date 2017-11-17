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
  if (requestedCourse in courses) {
    var data = courses[requestedCourse];
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(data));
  } else {
    res.send("Course not found");
  }
});

module.exports = router;