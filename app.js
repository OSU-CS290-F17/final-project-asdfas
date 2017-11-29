var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var api = require('./routes/api');
var scheduler = require('./routes/scheduler');

var addCourse = require('./routes/addCourse');
var addBreak = require('./routes/addBreak');

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
  res.render('index');
});

app.post('/addCourse', addCourse);
app.post('/addBreak', addBreak);

module.exports = app;
