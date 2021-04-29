exports.admin_detail = function (req, res) {
  if (req.session.User != "admin") {
    res.render("admin", {
      mode: 0,
      layout: "admin_layout",
    });
  } else {
    res.redirect("/signin");
  }
};

exports.addProductForm = function (req, res) {
    if (req.session.User != "admin") {
      res.render("addProduct", {
        mode: 1,
        layout: "admin_layout",
        productType: ["gundam", "toys", "game"],
      });
    } else {
      res.redirect("/signin");
    }
  };
  
