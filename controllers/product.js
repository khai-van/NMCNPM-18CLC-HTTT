var fs = require("fs");
var currencyFormatter = require("currency-formatter");

var Product = require("../models/product");

exports.productsManage = function (req, res) {
  if (req.session.User != "admin") {
    Product.findProduct({}, (result) => {
      var listProducts = result;
      console.log(listProducts);
      res.render("productsManage", {
        mode: 0,
        layout: "admin_layout",
        productType: ["gundam", "toys", "game"],
        listProducts: listProducts,
      });
    });
  } else {
    res.redirect("/signin");
  }
};

exports.addProduct = function (req, res) {
  var product = req.body;
  product.price = currencyFormatter.format(product.price, { code: "VND" });
  
  product.files = [];
  for (var i = 0; i < req.files.length; i++) {
    product.files.push("/images/products/" + product.name + "/" + i + ".jpg");
  }
  Product.addProduct(product, (result) => {
    if (result) {
      var dir = "./public/images/products/" + product.name;
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      } catch (err) {
        console.error(err);
      }

      for (var i = 0; i < req.files.length; i++) {
        fs.writeFile(
          dir + "/" + i + ".jpg",
          req.files[i].buffer,
          "binary",
          function (err) {
            console.log(err);
          }
        );
      }
      res.status(200).send({
        state: "success",
      });
    } else {
      res.status(200).send({
        state: "fail",
      });
    }
  });
};

exports.adjustProduct = function (req, res) {
  var product = req.body;
  product.price = currencyFormatter.format(product.price, { code: "VND" });
  console.log(product.price);
  Product.adjustProduct(product.name, product, (result) => {
    console.log(result);
    if (result) {
      res.status(200).send({
        state: "success",
      });
    } else {
      res.status(200).send({
        state: "fail",
      });
    }
  });
};

exports.HomePage = function (req, res) {
  req.session.previous = "/";
  res.render("index");
};
