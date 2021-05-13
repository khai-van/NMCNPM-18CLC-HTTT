var product_Model = require("../models/product")

const sumProduct = (obj) => {
    if (obj === undefined || Object.keys(obj).length == 0) return 0;
    return Object.values(obj).reduce((a, b) => a + b);
}

exports.addToCart = function (req, res) {
    if (Object.keys(req.query).length !== 0) {
        if (req.session.Cart === undefined) {
            req.session.Cart = {};
        }
        if (req.session.Cart.hasOwnProperty(req.query.id)) {
            req.session.Cart[req.query.id] += parseInt(req.query.amount);
        } else {
            req.session.Cart[req.query.id] = parseInt(req.query.amount);
        }
        res.status(200).send({
            state: sumProduct(req.session.Cart),
        });
    } else {
        res.status(200).send({
            state: "fail",
        });
    }
};
exports.popFromCart = function (req, res) {
    if (Object.keys(req.query).length !== 0 && req.session.Cart !== undefined) {

        delete req.session.Cart[req.query.id];
        res.status(200).send({
            state: sumProduct(req.session.Cart),
        });
    } else {
        res.status(200).send({
            state: "fail",
        });
    }
};

exports.cartPage = function (req, res) {
    console.log(req.session);
    if (req.session.Cart !== undefined) {
        var cart = req.session.Cart;
        var listID = Object.keys(cart);
        var query = {
            id: {
                $in: listID
            }
        }
        product_Model.findProduct(query, (result) => {
            var ret = result;
            for (var i = 0; i < ret.length; i++) {
                ret[i].number = cart[ret[i].id];
            }
            res.render("cart", {
                userID: req.session.User,
                productType: ["gundam", "toys", "game"],
                listCart: ret,
                amount: sumProduct(req.session.Cart)
            });
        });
    } else {
        res.render("cart", {
            userID: req.session.User,
            productType: ["gundam", "toys", "game"],
            amount: sumProduct(req.session.Cart)
        });
    }
}

exports.purchasePage = function (req, res) {
    console.log("123",req.session);
    if (req.session.User && req.session.User != "admin") {
        if (req.session.Cart !== undefined && Object.keys(req.session.Cart).length !== 0) {
            var cart = req.session.Cart;
            
            product_Model.checkCart(cart, (result) => {
                console.log(result);
                if (result == 0) {
                    console.log("wrong");
                } else {
                    console.log(result);
                    var err;
                    var cart = req.session.Cart;
                    var listID = Object.keys(cart);
                    var query = {
                        id: {
                            $in: listID
                        }
                    }
                    product_Model.findProduct(query, (items) => {
                        var ret = items;
                        for (var i = 0; i < ret.length; i++) {
                            ret[i].number = cart[ret[i].id];
                            if(ret[i].id == result) err = ret[i].name;
                        }
                        console.log(err);
                        res.render("cart", {
                            userID: req.session.User,
                            productType: ["gundam", "toys", "game"],
                            listCart: ret,
                            err: err, 
                            amount: sumProduct(req.session.Cart)
                        });
                    });
                }
            });
        } else {
            res.redirect("/cartp");
        }
    } else {
        res.redirect("/signin");
    }
}