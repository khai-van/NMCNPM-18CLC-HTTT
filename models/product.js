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
function Purchase(list_items,id_cus,shipaddress, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var check = 0;
      var dbo = db.db("QuanLyCuaHang");
      var random_bill = 'B' + Math.floor((Math.random() * 1000000) + 1);
      // Kiểm tra id bill đã tồn tại chưa
      do {
          var query = { idbill: random_bill };
          dbo.collection("Bills").find(query).toArray((err, result) => {
              if (err) throw err;
              db.close();
              if (result.length == 0)
                  check = 1;
              else
                  random_bill = 'B' + Math.floor((Math.random() * 1000000) + 1);
          });
      }while(check==0)
      var total = 0;
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
      create_bill(random_bill, new Date(), total, id_cus, shipaddress, function (result) { }); // Tạo bill với các thông tin chung
      //Thêm các sản phẩm vào chi tiết của bill vừa tạo
      for (items in list_items) {
          create_detail_bill(random_bill, items.id, items.amount, items.price, function (result) { });
      }
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
//Thêm hóa đơn - đặt hàng thì thêm bill tương ứng
function create_bill(billcode,date,total,id_cus,shipaddress, callback) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("QuanLyCuaHang");
      var myobj = { idbill: billcode, date_created: new Date(date), total: total, by_customer: id_cus, delivery_address: shipaddress, status: "Đang xử lý" };
      dbo.collection("Bills").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
          return callback(1); //thêm thành công
      });
  });
}
//Thêm chi tiết hóa đơn - thêm 1 sản phẩm vào chi tiết hóa đơn
function create_detail_bill(id_bill,id_items,amount,price, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var query = { id: id_items }
        var getname = findProduct(query, function (result) {
            var dbo = db.db("QuanLyCuaHang");
            var myobj = { idbill: id_bill, id_items: id_items, name_items: result[0].name, amount: amount, unit_price: price, total_price: amount * price };
            dbo.collection("Detail_Bills").insertOne(myobj, function (err, res) {
                if (err) throw err;
                db.close();
                return callback(1); //thêm thành công
            });
        });
    });
}
//return list of bill of user
function get_bill(id_user,callback){
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { by_customer: id_user };
        dbo.collection("Bills").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //Khách hàng chưa có mua đơn hàng nào
            if (result.length == 0) {
                return callback(-1);
            }
            //Trả về danh sách bill của khách hàng
            return callback(result); 
        });
    });
}
//return list of items of bill 
function get_detail_bill(id_bill, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { idbill: id_bill };
        dbo.collection("Detail_Bills").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //Trả về danh sách sản phẩm của hóa đơn đó
            return callback(result);
        });
    });
}

//add comment to items -- user can be email/name/...
function add_comment(id_item,comment,user, callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var myobj = {
            id_item: id_item, comment: comment, by: user, date_created: new Date()};
        dbo.collection("Comments").insertOne(myobj, function (err, res) {
            if (err) throw err;
            db.close();
            return callback(1); //thêm thành công
            });
        });
}
// get all comment of item
function get_comments(item,callback) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = { id_item: item };
        dbo.collection("Comments").find(query).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //Trả về danh sách sản phẩm comment của sản phẩm đó
            return callback(result);
        });
    });
}

module.exports = {
  findProduct,
  addProduct,
  adjustProduct,
  create_bill,
  get_bill,
  get_amount,
  Purchase,
  create_detail_bill,
  get_detail_bill,
  add_comment,
  get_comments
};
