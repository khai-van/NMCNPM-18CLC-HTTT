var fs = require("fs");
var currencyFormatter = require("currency-formatter");

var productModel = require("../models/product");

const sumProduct = (obj) => {
  if (obj === undefined || obj === {}) return 0;
  return Object.values(obj).reduce((a, b) => a + b);
}

exports.productsManage = function (req, res) {
  if (req.session.User == "admin") {
    if (Object.keys(req.query).length !== 0) {
      var query = {
        type: {
          $in: req.query.types
        }
      };
      if (req.query.name) {
        query.name = {
          $regex: req.query.name,
          $options: "i"
        };
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
          userID: req.session.User,
          mode: 1,
          layout: "admin_layout",
          productType: ["gundam", "toys", "game"],
          listProducts: listProducts,
          amount: sumProduct(req.session.Cart)
        });
      });
    }
  } else {
    res.redirect("/signin");
  }
};

exports.addProduct = function (req, res) {
  var product = req.body;
  product.price = currencyFormatter.format(product.price, {
    code: "VND"
  });

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
  product.price = currencyFormatter.format(product.price, {
    code: "VND"
  });
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
    res.render("index", {
      userID: req.session.User,
      productType: ["gundam", "toys", "game"],
      listProducts: result,
      amount: sumProduct(req.session.Cart)
    });
  });
};

exports.categoryProduct = function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    var query = {
      type: {
        $in: req.query.types
      }
    };
    if (req.query.name) {
      query.name = {
        $regex: req.query.name,
        $options: "i"
      };
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
        userID: req.session.User,
        productType: ["gundam", "toys", "game"],
        listProducts: listProducts,
        amount: sumProduct(req.session.Cart)
      });
    });
  }
};

exports.productPage = function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    var id_product = req.query.id;
    var query = {
      id: id_product
    };
    productModel.findProduct(query, (result) => {
      var product = result;
      product[0].descript = product[0].descript.split("\n");
      productModel.get_comments(id_product, (comments) => {
        res.render("product", {
          comments: comments,
          userID: req.session.User,
          productType: ["gundam", "toys", "game"],
          product: product[0],
          amount: sumProduct(req.session.Cart)
        });
      });

    });
  }
};

exports.getcomment = function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    var id_product = req.query.id;
    productModel.get_comments(id_product, (result) => {
      res.render("product", {
        userID: req.session.User,
        productType: ["gundam", "toys", "game"],
        comments: result,
        amount: sumProduct(req.session.Cart)
      });
    });
  }
};