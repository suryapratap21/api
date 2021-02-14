const router = require("express").Router();

// import routes and middlewares
const authRoutes = require("./Auth.route");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.use("/auth", authRoutes);

// test route
router.get("/test", validateAccessToken, (req, res, next) => {
  console.log(req.payload);
  res.send("oh hi mark");
});

module.exports = router;
