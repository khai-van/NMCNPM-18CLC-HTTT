var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multer = require('multer');

var admin = require('./routes/admin');
var index = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.handlebars', hbs({defaultLayout:'layout'}));
app.set('view engine', '.handlebars');


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', index);
app.use('/admin', admin);


app.use(express.static(path.join(__dirname, 'public')));

app.listen(8000, function(){
	console.log('Server started on port '+8000)});

