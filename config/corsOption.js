const allowedOrigins = require("./allowedOrgin");

const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin", origin)
    console.log("allowedOrigins", allowedOrigins)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // console.log("consrs  allowed ");

      callback(null, true);
    } else {
      console.log("consrs not allowed ");
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
