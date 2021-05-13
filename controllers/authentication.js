var customerModel = require("../models/customer");

const sumProduct = (obj) => {
  if (obj === undefined || Object.keys(obj).length == 0) return 0;
  return Object.values(obj).reduce((a, b) => a + b);
}

exports.signInPage = function (req, res) {
  res.render("signin", {
    productType: ["gundam", "toys", "game"],
    amount: sumProduct(req.session.Cart)
  });
};

exports.signUpPage = function (req, res) {
  res.render("signup", {
    productType: ["gundam", "toys", "game"],
    amount: sumProduct(req.session.Cart)
  });
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
        if (req.session.previous) {
          res.redirect(req.session.previous);
        } else {
          res.redirect("/");
        }

      } else

        res.render("signin", {
          notif: true,
          content: "Email hoặc mật khẩu không đúng!",
          amount: sumProduct(req.session.Cart)
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
        amount: sumProduct(req.session.Cart)
      });
    } else {
      res.render("signup", {
        notif: true,
        content: "Tài khoản đã tồn tại hoăc email không khả dụng!",
        amount: sumProduct(req.session.Cart)
      });
    }
  });
};