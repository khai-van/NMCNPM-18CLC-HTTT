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

function addProduct(Name, Price, Amount, Type, Description,callback) {
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
//Chi Duy -- Purchase gio hang
function Purchase(list_items,id_cus, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var total = 0;
        var random_bill = 'B' + Math.floor((Math.random() * 1000000) + 1);
        //Kiểm tra còn đủ số lượng sản phẩm để bán không?
 
        //Cập nhật lại số lượng sản phẩm còn lại và tính tổng tiền
        for (items in list_items) {
            get_amount(items.id, function (result) {
                var myquery = { id: items.id };
                var newvalues = { $set: { amount: result - items.amount } };
                dbo.collection("products").updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
            });
            total += items.price;
        };
        create_bill(random_bill,new Date(), total, id_cus, function (result) { });
    });
};
//lay so luong hien co cua 1 san pham
function get_amount(id_item, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { id: id_item };
        dbo.collection("products").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            if (result.length == 0) {
                return callback(-1);
            }
            return callback(result[0].amount);
        });
    });
}
//Thêm hóa đơn
function create_bill(billcode,date,total,id_cus, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var myobj = { idbill: billcode, date_created: new Date(date), total: total, by_customer: id_cus, status: "Đang xử lý" };
        dbo.collection("bills").insertOne(myobj, function (err, res) {
            if (err) throw err;
            db.close();
            return callback(1);
        });
    });
}
module.exports = { create_bill, get_amount, Purchase };
//Thêm chi tiết hóa đơn
//addProduct(Name, Price, Amount, Type, Description);
//get_amount("P676299", function (result) { console.log(result) });
//create_bill("123424", new Date(), 10000000, "xyz", function (result) { console.log(result) });
