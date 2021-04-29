var express = require('express');
var multer = require('multer');
var fs = require("fs");

var router = express.Router();
var upload = multer();

var admin_controller = require('../controllers/admin');
var product_controller = require('../controllers/product');

router.get('/', admin_controller.admin_detail);

router.get('/addProduct',admin_controller.addProductForm);

router.get('/products', product_controller.productsManage);

router.post("/addProduct", upload.array('upload', 10), product_controller.addProduct);

module.exports = router;