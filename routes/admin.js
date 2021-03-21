var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin', {layout: 'adminLayout'});
});

router.get('/addProduct', function(req, res, next) {
  res.render('addProduct', {layout: 'adminLayout', productType: ["gundam","toys","game"]});
});

router.post("/multiple-upload", function(req, res, next) {
  res.render('addProduct', {layout: 'adminLayout'});
});
module.exports = router;
