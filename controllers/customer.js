
var currencyFormatter = require("currency-formatter");

var customerModel = require("../models/customer");
var productModel = require("../models/product");

function join(t, a, s) {
  function format(m) {
     let f = new Intl.DateTimeFormat('en', m);
     return f.format(t);
  }
  return a.map(format).join(s);
}

const sumProduct = (obj) => {
  if (obj === undefined || Object.keys(obj).length == 0) return 0;
  return Object.values(obj).reduce((a, b) => a + b);
}

exports.infoPage = function (req, res) {
  if (req.session.User && req.session.User != "admin") {
    customerModel.getinfo_user(req.session.User, (result) => {
      var user = result;
      if (result != -1) {
        productModel.get_bill(req.session.User, (bill) => {
          let a = [{
            day: 'numeric'
          }, {
            month: 'numeric'
          }, {
            year: 'numeric'
          }];
          for (i in bill) {

            bill[i].date_created = join(bill[i].date_created, a, '-');
            bill[i].total = currencyFormatter.format(bill[i].total, { code: "VND"});
          }
          console.log(user);
          res.render("infoUser", {
            userID: req.session.User,
            info: user,
            amount: sumProduct(req.session.Cart),
            bill: bill
          });

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