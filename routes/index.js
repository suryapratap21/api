const router = require("express").Router();
const createError = require("http-errors");

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use("/api", (req, res, next) => {
  const error = new createError(
    404,
    "The page you are trying to access does not exist."
  );
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

module.exports = router;
