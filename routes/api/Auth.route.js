const router = require("express").Router();
const passport = require("passport");

// bring in models and controllers
const registerUser = require("../../controllers/auth/register");
const loginUser = require("../../controllers/auth/login");
// const refresh = require("../../controllers/auth/refresh");

// login user
router.post("/login", loginUser);

// register a user
router.post("/register", registerUser);

// generate new access-token using refresh-token
// router.post("/refresh-token", refresh);

// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// /api/auth/google/callback
router.get("/google/callback", passport.authenticate("google"));

module.exports = router;
