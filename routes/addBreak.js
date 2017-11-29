var express = require('express');
var router = express.Router();

router.post('/addBreak', function(req, res, next) {
  // Will need to add more advanced error checking
  if(req.body && req.body.name && req.body.length && req.body.startTime && req.body.endTime) {
    console.log('== Client added break:');
    console.log('  - name:', req.body.name);
    console.log('  - length:', req.body.length);
    console.log('  - startTime:', req.body.startTime);
    console.log('  - endTime:', req.body.endTime);


    // Add break to DB

    res.status(200).send('Break successfully added');
  }
  else {
    res.status(404).send('Error');
  }
});
module.exports = router;
