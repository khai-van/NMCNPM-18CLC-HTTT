// JavaScript source code
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//register account
function register(name, date, email, pass, number, address, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var random_id = "KH" + Math.floor(Math.random() * 1000000 + 1);
    var dbo = db.db("QuanLyCuaHang");
    var check = check_email(email, function (result) {
      if (result == 0) {
        db.close();
        return callback(-1); // Email already exists
      } else {
        var myobj = {
          id: random_id,
          fullname: name,
          date: new Date(date),
          email: email,
          password: pass,
          number: number,
          address: address,
        };
        dbo.collection("Customers").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
          return callback(1); // register success
        });
      }
    });
  });
}

// check email
function check_email(email, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { email: email };
        dbo.collection("Customers").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            if (result.length == 0) {
                return callback(1); // email already to use
            }
            return callback(0); //Email already exists
        });
    });
}
//check login
function login(username, pass, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = { email: username, password: pass };
    dbo.collection("Customers").find({ email: username, password: pass }).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        if (result.length == 0) {
          return callback(-1); // login fail = not created account
        }
        return callback(result[0].id); // login success
      });
  });
}

//get information of user with id
function getinfo_user(id, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = { id: id };
    dbo.collection("Customers").find(query).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        if (result.length == 0) {
          return callback(-1);
        }
        return callback(result[0]);
      });
  });
}

//update information of customers
function updateinfouser(user, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    getinfo_user(user.id, function (result) {
      if (result == -1) return callback(0); // user not created in database
    });
    var dbo = db.db("QuanLyCuaHang");
    var myquery = { id: user.id };
    var newvalues = {
      $set: {
        name: user.name,
        date: new Date(user.date),
        email: user.email,
        pass: user.pass,
        number: user.number,
        address: user.address,
      },
    };
    dbo
      .collection("customers")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        db.close();
        return callback(1); // updated
      });
  });
}

module.exports = { register, login, getinfo_user, updateinfouser };
