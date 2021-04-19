var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function findProduct(name, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = {
      name: name
    };
    dbo.collection("Products").find(query).toArray((err, result) => {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
}

function addProduct(product, callback) {
  findProduct(product.name, (result) => {
    if (Object.keys(result).length !== 0) { // the product doesn't exist
      return callback(0);
    } else { // else
      MongoClient.connect(url, {
        useUnifiedTopology: true
      }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("Products").insertOne(product, (err, result) => {
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
  addProduct
}