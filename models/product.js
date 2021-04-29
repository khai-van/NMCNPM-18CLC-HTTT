var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

function findProduct(query, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    dbo.find(query).toArray((err, result) => {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
}

function addProduct(product, callback) {
  findProduct({ name: product.name }, (res) => {
    if (Object.keys(res).length !== 0) {
      // the product doesn't exist
      return callback(0);
    } else {
      // else
      //genrateID
      findProduct({}, (result) => {
        //get list of ID
        var listID = result.map(function (obj) {
          return obj.id;
        });
        var ID;
        for (var i = 1; i; i++) {
          ID = "SP" + i;
          if (!listID.includes(ID)) break;
        }
        //add Product
        product.id = ID;
        console.log(product);
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
          if (err) throw err;
          var dbo = db.db("QuanLyCuaHang");
          dbo.collection("Products").insertOne(product, (err, result) => {
            if (err) throw err;
            db.close();
            return callback(1);
          });
        });
      });
    }
  });
}

function adjustProduct(product, callback) {
  findProduct({ id: product.id }, (result) => {
    if (Object.keys(result).length !== 0) {
      return callback(1);
    } else {
      MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { id: product.id };
        var value = { $set: product };
        dbo.collection("Products").updateOne(query, value, (err, result) => {
          if (err) throw err;
          db.close();
          return callback(1);
        });
      });
    }
  });
}

module.exports = {
  findProduct,
  addProduct,
  adjustProduct,
};
