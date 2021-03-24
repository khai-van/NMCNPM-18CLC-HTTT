var express = require('express');
var multer = require('multer');
var fs = require("fs");

var router = express.Router();

var upload = multer();

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('admin', {layout: 'adminLayout'});
});

router.get('/addProduct', function(req, res) {
	res.render('addProduct', {layout: 'adminLayout', productType: ["gundam","toys","game"]});
});

router.post("/addProduct", upload.array('upload',10), function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var amount = req.body.amount;
	var type = req.body.type;
	var descript = req.body.descript;

	req.checkBody('name', 'Chưa điền tên sản phẩm.').notEmpty();
	req.checkBody('price', ' Chưa điền giá sản phẩm.').notEmpty();
	req.checkBody('amount', 'Chưa điền số lượng.').notEmpty();
	req.checkBody('type', 'Chưa chọn loại sản phẩm.').not().equals("0");
	req.checkBody('descript', 'Chưa điền mô tả.').notEmpty();

	var errors = req.validationErrors();
	console.log(req.files);


	if(req.files.length == 0){
		errors.push({ param: 'file', msg: 'Không có file ảnh nào của sản phẩm.', value: ''})
	}

	if(errors){
		res.render('addProduct',{
			errors:errors, layout: 'adminLayout', productType: ["gundam","toys","game"]
		});
	}
	else {
		var dir = "./public/images/"+name;
		
		try {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir)
			}
		} catch (err) {
			console.error(err)
		}
		for(var i=0; i < req.files.length;i++){
			console.log(req.files[i]);
			fs.writeFile(req.files[i].originalname, req.files[i].buffer,'binary', function(err) {
				console.log(err);
			});
		}
		res.render('addProduct',{
			success: true, layout: 'adminLayout', productType: ["gundam","toys","game"]});
	}
	

});
module.exports = router;
