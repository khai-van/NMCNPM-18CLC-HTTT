var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
const session = require('express-session');

var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");

var app = express();

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", hbs({
	defaultLayout: "layout",
	extname: ".hbs"
}));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(8000, function () {
	console.log("Server started on port " + 8000);
});