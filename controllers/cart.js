const sumProduct = (obj) => {
    if (obj === undefined || obj === {}) return 0;
    return Object.values(obj).reduce((a, b) => a + b);
}

exports.addToCard = function(req,res){
    if(Object.keys(req.query).length !== 0){
        if (req.session.Cart === undefined){
            req.session.Cart = {};
        }
        if(req.session.Cart.hasOwnProperty(req.query.id)){
            req.session.Cart[req.query.id] += parseInt(req.query.amount);
        }
        else{
            req.session.Cart[req.query.id] = parseInt(req.query.amount);
        }
        console.log(req.session.Cart);
        res.status(200).send({
            state: sumProduct(req.session.Cart),
        });
    }
    else{
        res.status(200).send({
            state: "fail",
        });
    }
};
exports.popFromCard = function(req,res){
    if(Object.keys(req.query).length !== 0 && req.session.Cart !== undefined){
        console.log(req.query);
        req.session[req.query.id] -= parseInt(req.query.amount);
        if(req.session[req.query.id] === 0){
            delete req.session[req.query.id]
        }
        res.status(200).send({
            state:  sumProduct(req.session.Cart),
        });
    }
    else{
        res.status(200).send({
            state: "fail",
        });
    }
};