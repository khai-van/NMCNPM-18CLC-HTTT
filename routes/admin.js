var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer();

/* GET users listing. */
router.get('/', function (req, res, next) {
	if (req.session.User != "admin") {

		res.redirect("/signin");
	}
	res.render('admin', {
		mode: 0,
		layout: 'admin_layout'
	});
});
router.get('/addProduct', function (req, res) {
	if (req.session.User != "admin") {

		res.redirect("/signin");
	}
	res.render('addProduct', {
		mode: 1,
		layout: 'admin_layout',
		productType: ["gundam", "toys", "game"]
	});
});

router.post("/addProduct", upload.array('upload', 10), (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var amount = req.body.amount;
	var type = req.body.type;
	var descript = req.body.descript;

	console.log(req.body);
	console.log(req.files);



	/*var dir = "./public/images/"+name;

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
		mode: 1,success: true, layout: 'adminLayout', productType: ["gundam","toys","game"]});*/
	res.status(200).send({
		state: "success"
	});

});

module.exports = router;