var express = require("express");
var multer = require("multer");

var router = express.Router();
var upload = multer();

var customerController = require('../controllers/customer')
var product_controller = require('../controllers/product')

router.get('/info', customerController.infoPage);

router.post('/info', customerController.updateInfo);

router.get('/histor', customerController.logOut);

router.get('/logout', customerController.logOut);

router.get("/detailBill", product_controller.detailBill);

module.exports = router;