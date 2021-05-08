var customerModel = require("../models/customer");
var productModel = require("../models/product");

exports.infoPage = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    customerModel.getinfo_user(req.session.User, (result) => {
      if (result != -1) {
        req.render("info", { info: result });
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
        var id_user = req.sesion.User;
        if (Object.keys(req.query).length !== 0) {
            var cmt = req.body;
            var id_product = req.query.id;
            productModel.add_comment(id_product, cmt, id_user, (result) => {
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
        }
    }
    else {
        res.redirect("/signin");
    }
};

exports.logOut = function (req, res) {
  req.session.User = "";
  res.redirect("/");
};
