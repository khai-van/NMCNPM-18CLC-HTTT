var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

function findProduct(query, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    dbo.collection("Products").find(query).toArray((err, result) => {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
}
//get information from Bills
function findBills(query, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    dbo.collection("Bills").find(query).toArray((err, result) => {
      if (err) throw err;
      db.close();
      return callback(result);
    });
  });
}

function addProduct(product, callback) {
  findProduct({
    name: product.name
  }, (res) => {
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
        MongoClient.connect(url, {
          useUnifiedTopology: true
        }, (err, db) => {
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
  findProduct({
    id: product.id
  }, (result) => {
    if (Object.keys(result).length === 0) {
      return callback(0);
    } else {
      MongoClient.connect(url, {
        useUnifiedTopology: true
      }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("QuanLyCuaHang");
        var query = {
          id: product.id
        };
        var value = {
          $set: product
        };
        dbo.collection("Products").updateOne(query, value, (err, result) => {
          if (err) throw err;
          db.close();
          return callback(1);
        });
      });
    }
  });
}


function checkCart(cart, callback) { // Cart chuyền vào là một object có dạng { id_sanpham: so luong, ... } không phải list object [ {id:.., amount..},...] 
  var list_items = Object.keys(cart);
  var query = { // tạo query tìm tất các sản phẩm có id trong list_item
    id: {
      $in: list_items
    }
  }
  findProduct(query, (result) => {
    var products = result; // list sản phẩm có id trong cart
    for (item in products) {
      if (products[item].amount < cart[products[item].id]) return callback(products[item].id);
    }
    return callback(0);
  });
}
function Purchase(cart, id_cus, shipaddress, callback) {
  console.log("cart",cart);
  checkCart(cart, (result) => {
    console.log("check cart",result);
      if (result == 0) {
          //Tạo id bill
          findBills({}, (result) => {
              //get list of IDbill
              var listID = result.map(function (obj) {
                  return obj.idbill;
              });
              var ID_bill;
              for (var i = 1; i; i++) {
                  ID_bill = "B" + i;
                  if (!listID.includes(ID_bill)) break;
              }
              //
              var list_items = Object.keys(cart);
              var query = { // tạo query tìm tất các sản phẩm có id trong list_item
                  id: {
                      $in: list_items
                  }
              }
              findProduct(query, (list_products) => {
                  var new_detail_value = [];
                  var new_value = []; // list moi co dang [{id: SP1, amount: ..}, {id:SP2, amount:},...]
                  var total = 0;
                  for (i in cart) {
                      var temp = {};
                      var temp2 = {}; //lưu vào detail bill
                      temp.id = i;
                      temp2.id = i;
                      for (j in list_products) {
                          if (list_products[j].id == i) {
                              temp.amount = list_products[j].amount - cart[i];
                              temp2.name = list_products[j].name;
                              temp2.amount = cart[i];
                              // format lại giá tiền
                              var price = list_products[j].price;
                              price = price.split('.').join('');
                              price = price.split(' ₫').join('');
                              temp2.unit_price = parseFloat(price);
                              temp2.total_price = cart[i] * parseFloat(price);
                              total += temp2.total_price;
                              break;
                          }
                      }
                      new_value.push(temp);
                      temp2.ID_bill = ID_bill;
                      new_detail_value.push(temp2);
                  }
                  //Tạo bill
                  create_bill(ID_bill, new Date(), total, id_cus, shipaddress, function (result) { });
                  //Tạo Detail Bill
                  create_detail_bill(new_detail_value, function (result) { });
                  MongoClient.connect(url, {
                      useUnifiedTopology: true
                  }, (err, db) => {
                      if (err) throw err;
                      var dbo = db.db("QuanLyCuaHang");
                      dbo.collection("Products").bulkWrite(new_value.map((item) => ({ // update nhieu value
                          updateOne: {
                              filter: {
                                  id: item.id
                              },
                              update: {
                                  $set: item
                              }
                          }
                      })));
                          return callback(0);
                  });
              })
          });
      } else {
          db.close();
          return callback(result);
      }
  });
}

//lay so luong hien co cua 1 san pham
function get_amount(id_item, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = {
      id: id_item
    };
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
function create_bill(billcode, date, total, id_cus, shipaddress, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var myobj = {
      idbill: billcode,
      date_created: new Date(date),
      total: total,
      by_customer: id_cus,
      delivery_address: shipaddress,
      status: "Đang xử lý"
    };
    dbo.collection("Bills").insertOne(myobj, function (err, res) {
      if (err) throw err;
      db.close();
      return callback(1); //thêm thành công
    });
  });
}
//Thêm chi tiết hóa đơn - thêm list sản phẩm của 1 hóa đơn
function create_detail_bill(list_items, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
   var dbo = db.db("QuanLyCuaHang");
    if (err) throw err;
      dbo.collection("Detail_Bills").insertMany(list_items, function (err, res) {
        if (err) throw err;
        db.close();
        return callback(1); //thêm thành công
      });
  });
}
//return list of bill of user
function get_bill(id_user, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = {
      by_customer: id_user
    };
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
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = {
      ID_bill: id_bill
    };
    dbo.collection("Detail_Bills").find(query).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      //Trả về danh sách sản phẩm của hóa đơn đó
      return callback(result);
    });
  });
}

//add comment to items -- user can be email/name/...
function add_comment(id_item, comment, user, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var n = new Date();
    var myobj = {
      id_item: id_item,
      comment: comment,
      by: user,
      date_created: n.toDateString() + " " + n.toLocaleTimeString()
    };
    dbo.collection("Comments").insertOne(myobj, function (err, res) {
      if (err) throw err;
      db.close();
      return callback(1); //thêm thành công
    });
  });
}
// get all comment of item
function get_comments(item, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("QuanLyCuaHang");
    var query = {
      id_item: item
    };
    dbo.collection("Comments").find(query).toArray(function (err, result) {
      if (err) throw err;
      db.close();
      //Trả về danh sách comment của sản phẩm đó
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
  checkCart,
  create_detail_bill,
  get_detail_bill,
  add_comment,
  get_comments
};