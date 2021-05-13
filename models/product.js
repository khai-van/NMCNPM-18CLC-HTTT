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

//Chi Duy -- Purchase gio hang
function Purchase(list_items, id_cus, shipaddress, callback) {
  console.log(list_items);
  //Kiểm tra còn đủ số lượng sản phẩm để bán không?
  checkCart(list_items, function (result) {
    console.log(result);
    if (result == 0) {
      // Kiểm tra id bill đã tồn tại chưa
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
        let total = 0;
        //Cập nhật lại số lượng sản phẩm còn lại và tính tổng tiền
        var list_id = Object.keys(list_items);
        var query = { // tạo query tìm tất các sản phẩm có id trong list_item
          id: {
            $in: list_id
          }
        }
        findProduct(query, (result) => {
          var products = result; // list sản phẩm có id trong cart
          for (item in products) {
            list_items[products[item].id] = products[item].amount - list_items[products[item].id];
            total += (products[item].price * products[item].amount);
          }
          for (item in list_items) {
            var myquery = {
              id: item
            };
            console.log(newvalues);
            var newvalues = {
              $set: {
                amount: list_items[item]
              }
            };
            MongoClient.connect(url, {
              useUnifiedTopology: true
            }, function (err, db) {
              if (err) throw err;
              var check = 0;
              var dbo = db.db("QuanLyCuaHang");
              dbo.collection("Products").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
                return callback(0);
              });
            });
          }
        });
        /*
        for (items in list_items) {
            let id = items;
            get_amount(id, function (result) {
                var myquery = { id: id };
                var newvalues = { $set: { amount: result - list_items[id] } };
                dbo.collection("Products").updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
            });
            var query = { id: id }
            */
        /*findProduct(query, function (result) {
            total += result[0].price;
            create_detail_bill(ID_bill, id, list_items[id], result[0].price, function (result) { });
        });
        create_bill(ID_bill, new Date(), total, id_cus, shipaddress, function (result) { }); // Tạo bill với các thông tin chung*/

      });
    } else {
      db.close();
      return callback(result);
    }
  });
};

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

function Purchase1(cart, callback) {
  console.log("cart",cart);
  checkCart(cart, (result) => {
    console.log("check cart",result);
    if (result == 0) {
      var list_items = Object.keys(cart);
      var query = { // tạo query tìm tất các sản phẩm có id trong list_item
        id: {
          $in: list_items
        }
      }
      findProduct(query, (list_products) => {
        var new_value = []; // list moi co dang [{id: SP1, amount: ..}, {id:SP2, amount:},...]
        for (i in cart) {
          var temp = {};
          temp.id = i;
          for (j in list_products) {
            if (list_products[j].id == i) {
              temp.amount = list_products[j].amount - cart[i];
              break;
            }
          }
          new_value.push(temp);
        }
        console.log("new value",new_value);

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

      });
    } else return callback(result);
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
//Thêm chi tiết hóa đơn - thêm 1 sản phẩm vào chi tiết hóa đơn
function create_detail_bill(id_bill, id_items, amount, price, callback) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, function (err, db) {
    if (err) throw err;
    var query = {
      id: id_items
    }
    var getname = findProduct(query, function (result) {
      var dbo = db.db("QuanLyCuaHang");
      var myobj = {
        idbill: id_bill,
        id_items: id_items,
        name_items: result[0].name,
        amount: amount,
        unit_price: price,
        total_price: amount * price
      };
      dbo.collection("Detail_Bills").insertOne(myobj, function (err, res) {
        if (err) throw err;
        db.close();
        return callback(1); //thêm thành công
      });
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
      idbill: id_bill
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
  Purchase1,
  checkCart,
  create_detail_bill,
  get_detail_bill,
  add_comment,
  get_comments
};