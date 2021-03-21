var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

var admin = require('./routes/admin');
var index = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.handlebars', hbs({defaultLayout:'layout'}));
app.set('view engine', '.handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);
app.use('/admin', admin);


app.use(express.static(path.join(__dirname, 'public')));

app.listen(8000, function(){
	console.log('Server started on port '+8000)});

