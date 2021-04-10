// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//register account
function register(name,date,email,pass,number,address,callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var random_id = 'KH' + Math.floor((Math.random() * 1000000) + 1);
        var dbo = db.db("mydb");
        var check = login(email, pass, function (result) {
            if (result != -1) {
                db.close();
                return callback(-1); // register account fail - exist account
            }
            else {
                var myobj = {
                    id: random_id, fullname: name, date: new Date(date), email: email, password: pass, number: number, address: address
                };
                dbo.collection("customers").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    db.close();
                    return callback(0); // register success
                });
            }
        });
    })
};

//check login
function login(username, pass, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { email: username, password: pass };
        dbo.collection("customers").find({ email: username, password: pass }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            if (result.length == 0) {
                return callback(-1); // login fail = not created account
            }
            return callback(result[0].id); // login success
        });
    });
}

// get all product in database
function getproduct(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("products").find().toArray(function (err, result) {
            if (err) throw err;
            db.close();
            return callback(result);
        });
    });
}
