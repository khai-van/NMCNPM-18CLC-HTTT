var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Con loi ham check

//check product exist (check 1 attribute. EX: name)
function checkExists(name) {
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("QuanLyCuaHang");
      dbo.collection("products").find({name: name}, {$exists: true}).toArray(function(err, check)
      {     
          if(check) //if it existed
          {
            return callback(0);
          }
          else if(!check) //if it does not 
          {
            return callback(-1);
          }
      })
  });
};
//add product - chua co xu ly viec them anh
var Name = "Jinx";
var Price = 30000;
var Amount = 200;
var Type = "LoL";
var Description = "JKhfjdshfjdjfk";

function addProduct(Name, Price, Amount, Type, Description) {
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("QuanLyCuaHang");
      var random_pd = 'P' + Math.floor((Math.random() * 1000000) + 1);
      if(checkExists(Name)==0)
      {
        return callback(-1); // add fail - product is existed
      }
      else
      {
        var myobj = { id: random_pd, name: Name, price: Price, amount: Amount, type: Type, description: Description };
        dbo.collection("products").insertOne(myobj, function (err, res) 
        {
          if (err) throw err;
          db.close();
          return callback(0); // add success
        });
      }
  })
};
addProduct(Name, Price, Amount, Type, Description);