const tryCatch = (controller) => {
  return async (req, res) => {
    try {
      await controller(req, res);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  };
};

exports.tryCatch = tryCatch;