var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var indexData = require('./dummyIndex');

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu" //process.env.MONGO_HOST;         //
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = "cs290_gillens" //process.env.MONGO_USER;
var mongoPassword = "cs290_gillens" // process.env.MONGO_PASSWORD;
var mongoDBName = "cs290_gillens" //process.env.MONGO_DB;

var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
// console.log(mongoURL);

var mongoConnection = null;

var api = require('./routes/api');
var scheduler = require('./routes/scheduler');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'application' }))
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/schedules', scheduler);
app.get('/', function(req, res, next) {
	
     
var listData = mongoConnection.collection('scheduleData'); 

     
      
listData.find({}).toArray(function (err, results){
	
	res.render('index', {classSet: results});

});
  
  // res.render('index', {classSet: listData});
  
});

app.get('/edit', function(req, res, next) {
  res.render('edit');
});
// app.get('/edit/:id', function(req, res, next) {
//   res.render('edit');
// });

MongoClient.connect(mongoURL, function (err, connection) {
  if (err) {
    throw err;
  }
  mongoConnection = connection;
  console.log("Established a connection to DB");
});
module.exports = app;
