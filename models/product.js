var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

function findProduct(query, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    dbo.collection("Products").find(query).toArray((err, result) => {
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
    if (Object.keys(result).length === 0) {
      return callback(0);
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

//Chi Duy -- Purchase gio hang
function Purchase(list_items,id_cus, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("QuanLyCuaHang");
      var total = 0;
      var random_bill = 'B' + Math.floor((Math.random() * 1000000) + 1);
      //Kiểm tra còn đủ số lượng sản phẩm để bán không?
      for (items in list_items) {
          get_amount(items.id, function (result) {
              if (result < items.amount)
                  return callback(items); // trả về sản phẩm hết hàng
          });
      }
      //Cập nhật lại số lượng sản phẩm còn lại và tính tổng tiền
      for (items in list_items) {
          get_amount(items.id, function (result) {
              var myquery = { id: items.id };
              var newvalues = { $set: { amount: result - items.amount } };
              dbo.collection("Products").updateOne(myquery, newvalues, function (err, res) {
                  if (err) throw err;
                  db.close();
              });
          });
          total += items.price;
      };
      create_bill(random_bill,new Date(), total, id_cus, function (result) { });// nếu thành công trả về cái gì ???
  });
};
//lay so luong hien co cua 1 san pham
function get_amount(id_item, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("QuanLyCuaHang");
      var query = { id: id_item };
      dbo.collection("Products").find(query).toArray(function (err, result) {
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
      dbo.collection("Bills").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
          return callback(1); // phải trả về hóa đơn để còn in ra chứ ??
      });
  });
}

//return list of bill of user
function get_bill(id_user,callback){

}

module.exports = {
  findProduct,
  addProduct,
  adjustProduct,
  create_bill,
  get_bill,
  get_amount,
  Purchase
};
