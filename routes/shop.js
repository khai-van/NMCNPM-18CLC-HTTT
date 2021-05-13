var express = require("express");
var multer = require("multer");

var upload = multer();


var router = express.Router();
var authentication_controller = require("../controllers/authentication");
var product_controller = require("../controllers/product");
var cart_controller = require("../controllers/cart")
var customer_controller = require("../controllers/customer")

/* GET home page. */
router.get("/", product_controller.HomePage);

router.get("/signin", authentication_controller.signInPage);

router.get("/signup", authentication_controller.signUpPage);
 
router.post("/signin", authentication_controller.signIn);

router.post("/signup", authentication_controller.signUp);

router.get("/category",product_controller.categoryProduct);

router.get("/product", product_controller.productPage);

router.get("/cart", cart_controller.addToCart);

router.get("/popCart", cart_controller.popFromCart);

router.get("/cartp", cart_controller.cartPage);

router.get("/purchase", cart_controller.purchasePage);

router.post("/comment",upload.array('upload', 1), customer_controller.addcomment);

module.exports = router;
