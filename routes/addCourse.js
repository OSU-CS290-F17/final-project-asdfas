var express = require('express');
var router = express.Router();

router.post('/addCourse', function(req, res, next) {
  // Will need to add more advanced error checking
  if(req.body && req.body.subject && req.body.course) {
    console.log('== Client added course:');
    console.log('  - subject:', req.body.subject);
    console.log('  - course:', req.body.course);

    // Add course to DB

    res.status(200).send('Course successfully added');
  }
  else {
    res.status(404).send('Error');
  }
});
module.exports = router;
