var express = require('express');
var path = require('path');

var fs = require('fs')
var logger = require('morgan'); // logging middleware (https://www.npmjs.com/package/morgan)

var indexRouter = require('./routes/resp');

var app = express();
// express views folder and engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// set up logging - all HTTP requests will be logged to the http.log file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'http.log'), { flags: 'a' })

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('combined', { stream: accessLogStream }));


// built in express middleware parses incoming requests with JSON
app.use(express.json());


// extended false means you can not post "nested object" {a {b:c}}
// parses incoming requests with urlencoded
app.use(express.urlencoded({ extended: false }));

// make public folder visible for static files (client side javascript)
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


app.use(function (req, res, next) {
  res.status(404).send("Oops, looks like you landed at the wrong URL!")
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});



module.exports = app;
