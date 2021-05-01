exports.admin_detail = function (req, res) {
  if (req.session.User == "admin") {
    res.render("admin", {
      layout: "admin_layout",
    });
  } else {
    res.redirect("/signin");
  }
};

exports.addProductForm = function (req, res) {
  if (req.session.User == "admin") {
    res.render("addProduct", {
      mode: 2,
      layout: "admin_layout",
      productType: ["gundam", "toys", "game"],
    });
  } else {
    res.redirect("/signin");
  }
};

exports.logOut = function (req, res) {
  req.session.User = "";
  res.redirect("/");
};
