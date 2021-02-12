const router = require("express").Router();

const authRoutes = require("./Auth.route");

router.use("/auth", authRoutes);

module.exports = router;
