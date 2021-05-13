var customerModel = require("../models/customer");
var productModel = require("../models/product");

const sumProduct = (obj) => {
  if (obj === undefined || Object.keys(obj).length == 0) return 0;
  return Object.values(obj).reduce((a, b) => a + b);
}

exports.infoPage = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    customerModel.getinfo_user(req.session.User, (result) => {
      if (result != -1) {
        res.render("info", {
          userID: req.session.User,
          info: result,
          amount: sumProduct(req.session.Cart)
        });
      }
    });
  } else {
    res.redirect("/signin");
  }
};

exports.updateInfo = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    var customer = req.body;
    customerModel.updateinfouser(customer, (result) => {
      if (result) {
        res.status(200).send({
          state: ["success", customer],
        });
      } else {
        res.status(200).send({
          state: ["fail"],
        });
      }
    });
  } else {
    res.redirect("/signin");
  }
};

exports.getHistory = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    var id = req.sesion.User;
    productModel.get_bill(id, (result) => {
      if (result) {
        res.status(200).send({
          state: ["success", result],
        });
      } else {
        res.status(200).send({
          state: ["fail"],
        });
      }
    });
  } else {
    res.redirect("/signin");
  }
};

exports.addcomment = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    var id_user = req.session.User;
    productModel.add_comment(req.body.id, req.body.review, id_user, (result) => {
      res.status(200).send({
        state: result,
      });
    });
  } else {
    res.redirect("/signin");
  }
};

exports.logOut = function (req, res) {
  req.session.User = "";
  res.redirect("/");
};