var express = require("express");
var multer = require("multer");

var router = express.Router();
var upload = multer();

var authentication_controller = require("../controllers/authentication");
var product_controller = require("../controllers/product");

/* GET home page. */
router.get("/", product_controller.HomePage);

router.get("/signin", authentication_controller.signIn);

router.get("/signup", authentication_controller.signUpPage);

router.post("/signin", authentication_controller.signIn);

router.post("/signup", authentication_controller.signUp);

module.exports = router;
