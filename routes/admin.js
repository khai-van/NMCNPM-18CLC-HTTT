var express = require('express');
var multer = require('multer');
var fs = require("fs");

var router = express.Router();
var upload = multer();

var Product = require("../models/product")

/* GET users listing. */
router.get('/', function (req, res, next) {

	if (req.session.User == "admin") {
		res.render('admin', {
			mode: 0,
			layout: 'admin_layout'
		});
	} else {
		res.redirect("/signin");
	}
});
router.get('/addProduct', function (req, res) {
	if (req.session.User == "admin") {
		res.render('addProduct', {
			mode: 1,
			layout: 'admin_layout',
			productType: ["gundam", "toys", "game"]
		});
	} else {
		res.redirect("/signin");
	}

});
router.get('/products', function (req, res) {
	if (req.session.User == "admin") {
		res.render('products', {
			mode: 0,
			layout: 'admin_layout',
			productType: ["gundam", "toys", "game"]
		});
	} else {
		res.redirect("/signin");
	}

});

router.post("/addProduct", upload.array('upload', 10), (req, res) => {
	var product = req.body;

	
	
	product.price = product.price.toLocaleString('it-IT', {
		style: 'currency',
		currency: 'VND'
	});

	product.files = [];
	for (var i = 0; i < req.files.length; i++) {
		product.files.push("/images/products" + product.name + "/" + i + ".jpg");
	}
	Product.addProduct(product, (result) => {
		console.log(result);
		if (result) {
			var dir = "./public/images/products/" + product.name;
			try {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir)
				}
			} catch (err) {
				console.error(err)
			}

			for (var i = 0; i < req.files.length; i++) {
				fs.writeFile(dir + "/" + i + ".jpg", req.files[i].buffer, 'binary', function (err) {
					console.log(err);
				});
			}
			res.status(200).send({
				state: "success"
			});
		} else {
			res.status(200).send({
				state: "fail"
			});
		}
	});





});

module.exports = router;