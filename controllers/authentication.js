var customerModel = require("../models/customer");
 

exports.signInPage = function (req, res) {
  res.render("signin");
};

exports.signUpPage = function (req, res) {
  res.render("signup");
};

exports.signIn = function (req, res) {
  var email = req.body.email;
  var pass = req.body.password;

  if (email == "admin@gmail.com") {
    req.session.User = "admin";
    res.redirect("/admin");
  } else {
    customerModel.login(email, pass, (result) => {
      if (result != -1) {
        req.session.User = result;
        if(req.session.previous){
          res.redirect(req.session.previous);
        } else{
          res.redirect("/"); 
        }
        
      } else

        res.render("signin", {
          notif: true,
          content: "Email hoặc mật khẩu không đúng!",
        });
    });
  }
};

exports.signUp = function (req, res) {
  var name = req.body.name;
  var dob = req.body.dob;
  var email = req.body.email;
  var pass = req.body.password;
  var phone = req.body.phone;
  var address = req.body.address;

  customerModel.register(name, dob, email, pass, phone, address, (result) => {
    if (result == 1) {
      res.render("signin", {
        notif: true,
        content: "Đã tạo tài khoản thành công!",
      });
    } else {
      res.render("signup", {
        notif: true,
        content: "Tài khoản đã tồn tại hoăc email không khả dụng!",
      });
    }
  });
};
