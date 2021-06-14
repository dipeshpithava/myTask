var express = require('express');

var app = express();
var constants = require('constants');
var constant = require('./config/constants');

var port = process.env.PORT || 8042;

var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // read cookies (needed for auth)

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


/* React Routes */


// routes ======================================================================
require('./config/routes.js')(app); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.status(404).render('404', { title: "Sorry, page not found" });
});

app.use(function (req, res, next) {
	res.status(500).render('404', { title: "Sorry, page not found" });
});
exports = module.exports = app;