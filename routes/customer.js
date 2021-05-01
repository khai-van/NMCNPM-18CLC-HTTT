var express = require("express");
var multer = require("multer");

var router = express.Router();
var upload = multer();

var customerController = require('../controllers/customer')

router.get('/info', customerController.infoPage);

router.post('/info', customerController.updateInfo);

router.get('/histor', customerController.logOut);

router.get('/logout', customerController.logOut);



module.exports = router;