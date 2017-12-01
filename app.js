var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

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
  res.render('index');
});

app.get('/edit', function(req, res, next) {
  res.render('edit');
});


module.exports = app;
