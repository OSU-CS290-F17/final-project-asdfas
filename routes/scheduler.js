var express = require('express');
var router = express.Router();
var indexData = require('../dummyIndex');
var ObjectID = require('mongodb').ObjectID;

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu" //process.env.MONGO_HOST;         //
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = "cs290_gillens" //process.env.MONGO_USER;
var mongoPassword = "cs290_gillens" // process.env.MONGO_PASSWORD;
var mongoDBName = "cs290_gillens" //process.env.MONGO_DB;

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
console.log(mongoURL);

var mongoConnection = null;

//create
router.post('/save', function (req, res) {
  var schedule = req.body;

  console.log('\n\n\n Inside post route, adding this saved schedule link: ', schedule['link']);
  var scheduleDataCollection = mongoConnection.collection('scheduleData');
  scheduleDataCollection.insertOne(schedule, (function (err, results) {
    if (err) {
      throw err;
    }
    res.status(200).send("Added schedule to database");
  }
  ));
  //if ID was just generated
  if (schedule['link'] == 'temp') {
    scheduleDataCollection.find({ "link": "temp" }).toArray(function (err, results) {
      if (err) {
        throw err;
      }
      console.log("\n\n\n\n Success!!", results[0]._id);
      var newLink = "/edit/" + results[0]._id;
      
      scheduleDataCollection.updateOne({ "_id": new ObjectID(results[0]._id) }, { $set: { link: '/edit' }}, function (err, response) {
        console.log("\n\n\n Updated it");
      }    );
      scheduleDataCollection.updateOne({ "_id": new ObjectID(results[0]._id) }, { $set: { name: newLink }}, function (err, response) {
        console.log("\n\n\n Updated it");
      }    );

    });
  }
});

//Read
router.get('/all', function (req, res) {
  var scheduleDataCollection = mongoConnection.collection('scheduleData');
  scheduleDataCollection.find({}).toArray(function (err, results) {
    if (err) {
      throw err;
    }
    console.log("Results: ", results);
    console.log(indexData);
    res.status(200).header("Content-Type", 'application/json').send(indexData);
  });
});

//update
router.post('/:id/save', function (req, res) {
  var requestedId = req.params.id.toString();
  var schedule = req.body;
  var scheduleDataCollection = mongoConnection.collection('scheduleData');
  console.log("trying to find " + requestedId + " in mongo database");

  //if _id in DB, then update DB
  scheduleDataCollection.updateOne({ "_id": new ObjectID(requestedId) }, schedule, function (err, response) {
    if (err) {
      res.status(500).header("Content-Type", 'text/plain');
      res.send("Error fetching class from DB");
    } else if (response['matchedCount'] == 1) {
      res.status(200).header("Content-Type", 'text/plain');
      res.send("Successful update");
      console.log("Updated");
    } else {
      console.log("Your query matched this many results:", response['matchedCount']);
      res.status(404).header("Content-Type", 'text/plain');
      res.send("Schedule not found");
    }
  });
});

router.delete('/:id/delete', function (req, res) {
  var requestedId = req.params.id.toString();
  var scheduleDataCollection = mongoConnection.collection('scheduleData');
  console.log("Received delete request");

  //if _id in DB, then remove it
  var ObjectID = require('mongodb').ObjectID;
  scheduleDataCollection.removeOne({ "_id": new ObjectID(requestedId) }, function (err, response) {
    if (err) {
      res.status(500).header("Content-Type", 'text/plain');
      res.send("Error removing class from DB");
    } else if (response['deletedCount'] == 1) {
      res.status(200).header("Content-Type", 'text/plain');
      res.send("Successful remove");
      console.log("Updated");
    } else {
      console.log("Your query matched this many results:", response['deletedCount']);
      res.status(404).header("Content-Type", 'text/plain');
      res.send("Schedule not found");
    }
  });
  console.log("Done processing delete");
});


MongoClient.connect(mongoURL, function (err, connection) {
  if (err) {
    throw err;
  }
  mongoConnection = connection;
  console.log("Established a connection to DB");
});


module.exports = router;