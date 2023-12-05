module.exports = function (validator) {
      return (req, res, next) => {
            const { error } = validator(req.body);
            if (error)
                  return res
                        .status(400)
                        .json({ massage: error.details[0].message });
            next();
      };
};
