const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      // console.log("the autheade given by is ", authHeader);
      // console.log("the req headers is ", req.headers);
      if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)
                  return res.status(403).json({
                        message: "acceess token is not vaild ",
                  });
            req.user = decoded.userData.userId;
            req.role = decoded.role;
            // console.log("decoded ", decoded, "and ", req.user);
            next();
      });
};

exports.verifyJWT = verifyJWT;
