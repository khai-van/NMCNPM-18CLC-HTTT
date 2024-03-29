var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
const session = require("express-session");

var customerRouter = require("./routes/customer");
var adminRouter = require("./routes/admin");
var shopRouter = require("./routes/shop");

var app = express();

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: { maxAge: 60000 },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  hbs({
    defaultLayout: "layout",
    extname: ".hbs",
    helpers:{
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
}}));
app.set("view engine", ".hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", shopRouter);
app.use("/admin", adminRouter);
app.use("/user", customerRouter);

app.listen(8000, function () {
  console.log("Server started on port " + 8000);
});
