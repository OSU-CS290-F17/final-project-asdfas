var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var indexData = require('./dummyIndex');


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
	var request = new XMLHttpRequest();
    var requestURL = '/schedules/all';
    request.open('GET', requestURL);
   	request.addEventListener('load', function(event) {

        if(event.target.status !== 200) {
          var message = event.target.response;
          alert(message);
        }
        else {
         	var indexData = JSON.parse(event.target.response);
          
          };
         
        };
    request.send();
     
      
      
    
  
  res.render('index', {classSet: indexData});
});

app.get('/edit', function(req, res, next) {
  res.render('edit');
});
// app.get('/edit/:id', function(req, res, next) {
//   res.render('edit');
// });


module.exports = app;
