const userAuth = (req, res, next) => {
  if (req.role == "user") return next();
  else
    return res
      .status(403)
      .json("only user can access this route and token provided is not a user");
};

exports.userAuth = userAuth;
