var express = require('express');
var path = require('path');
var session = require('express-session');
var flash = require('express-flash');

var dashboard = require('./routes/dashboard');
var login = require('./routes/login');
var register = require('./routes/register');
var game = require('./routes/game');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// session
var mySession = session({
  resave: false,
  saveUninitialized: true,
  secret: "ayy lmao",
  maxAge: 1000 * 60 * 30
});
app.use(mySession);

app.use(flash());

// body parsing
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

app.get('/', function (req, res) {
  res.redirect('/dashboard');
});

app.use('/dashboard', isLoggedIn, dashboard);
app.use('/login', login);
app.use('/register', register);
app.use('/game', isLoggedIn, game);
app.use('/logout', logout);

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('error', 'Login first!');
    res.redirect('/login');
  }
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.session = mySession;