var fs = require("fs");
var currencyFormatter = require("currency-formatter");

var productModel = require("../models/product");

exports.productsManage = function (req, res) {
  if (req.session.User == "admin") {
    if (Object.keys(req.query).length !== 0) {
      var query = { type: { $in: req.query.types } };
      if (req.query.name) {
        query.name = { $regex: req.query.name, $options: "i" };
      }
      productModel.findProduct(query, (result) => {
        res.status(200).send({
          state: result,
        });
      });
    } else {
      productModel.findProduct({}, (result) => {
        var listProducts = result;
        res.render("productsManage", {
          mode: 1,
          layout: "admin_layout",
          productType: ["gundam", "toys", "game"],
          listProducts: listProducts,
        });
      });
    }
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
  productModel.addProduct(product, (result) => {
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
  productModel.adjustProduct(product, (result) => {
    if (result) {
      res.status(200).send({
        state: ["success", product],
      });
    } else {
      res.status(200).send({
        state: ["fail"],
      });
    }
  });
};

exports.HomePage = function (req, res) {
  req.session.previous = "/";
  productModel.findProduct({}, (result) => {
    console.log(result);
    res.render("index", {
      productType: ["gundam", "toys", "game"],
      listProducts: result,
    });
  });
};

exports.categoryProduct = function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    var query = { type: { $in: req.query.types } };
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    productModel.findProduct(query, (result) => {
      res.status(200).send({
        state: result,
      });
    });
  } else {
    productModel.findProduct({}, (result) => {
      var listProducts = result;
      
      res.render("category", {
        productType: ["gundam", "toys", "game"],
        listProducts: listProducts,
      });
    });
  }
};

exports.productPage = function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    var id_product = req.query.id;
    var query = { id: id };
    productModel.findProduct(query, (result) => {
      res.render("product", {
        productType: ["gundam", "toys", "game"],
        product: result,
      });
    });
  }
};
