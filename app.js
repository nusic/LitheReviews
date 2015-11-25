//Connect to mongo db
var mongoose = require('mongoose');
require('./models/Users');
require('./models/Courses');
require('./models/Programs');
require('./models/Reviews');
require('./models/ExamData');
var mongoose_url = 'mongodb://' + process.env.MONGOLAB_USER + 
    ':' + process.env.MONGOLAB_PW + '@ds043694.mongolab.com:43694/liureviews';
mongoose.connect(mongoose_url);

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var cas_auth = require('./routes/cas_auth.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());

app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 3*60*60*1000 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// CAS
app.use('/', cas_auth.myValidate);

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.url + " method: " + req.method);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
