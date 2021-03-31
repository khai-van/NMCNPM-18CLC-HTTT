var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/getCity",function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/getCity", upload.array('upload',10), (req, res) => {

    console.log(req.files);
    console.log(req.body);
    res.status(200).send({ cityID: '123' });
   
});
module.exports = router;
