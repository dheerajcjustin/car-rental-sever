const vendorAuth = (req, res, next) => {
  if (req.role == "vendor") return next();
  else
    return res
      .status(403)
      .json(
        "only vendor can access this route and token provided is not a vendor"
      );
};

exports.vendorAuth = vendorAuth;
