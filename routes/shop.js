var express = require("express");

var router = express.Router();
var authentication_controller = require("../controllers/authentication");
var product_controller = require("../controllers/product");

/* GET home page. */
router.get("/", product_controller.HomePage);

router.get("/signin", authentication_controller.signInPage);

router.get("/signup", authentication_controller.signUpPage);
 
router.post("/signin", authentication_controller.signIn);

router.post("/signup", authentication_controller.signUp);

router.get("/category",product_controller.categoryProduct);

router.get("/product", product_controller.productPage);

module.exports = router;
