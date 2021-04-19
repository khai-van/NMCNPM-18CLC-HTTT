var express = require('express');
var multer = require('multer');

var userModel = require("../models/function");

var router = express.Router();
var upload = multer();

/* GET home page. */
router.get('/', function (req, res, next) {
  req.session.previous = "/";
  res.render('index');
});
router.get("/signin", function (req, res, next) {
  res.render('signin');
});
router.get("/signup", function (req, res, next) {
  res.render('signup');
});


router.post("/signin", function (req, res, next) {
  var email = req.body.email;
  var pass = req.body.password;

  if (email == "admin@gmail.com") {
    req.session.User = "admin";
    res.redirect("/admin");
  } else {
    userModel.login(email, pass, (result) => {
      if (result != -1) {
        req.session.User = result;
        res.redirect(req.session.previous);

      } else
        res.render('signin', {
          notif: true,
          content: 'Email hoặc mật khẩu không đúng!'
        });
    });
  }
});

router.post("/signup", function (req, res, next) {
  var name = req.body.name;
  var dob = req.body.dob;
  var email = req.body.email;
  var pass = req.body.password;
  var phone = req.body.phone;
  var address = req.body.address;

  userModel.register(name, dob, email, pass, phone, address, (result) => {
    if (result == 1) {
      res.render('signin', {
        notif: true,
        content: 'Đã tạo tài khoản thành công!'
      });
    } else {
      res.render('signup', {
        notif: true,
        content: 'Tài khoản đã tồn tại hoăc email không khả dụng!'

      });
    }
  })


});

module.exports = router;