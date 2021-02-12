const router = require("express").Router();
const passport = require("passport");

// bring in models and controllers
const registerUser = require("../../controllers/Auth.controller.js");

// register a user
router.post("/register", registerUser);

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
