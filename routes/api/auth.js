const router = require("express").Router();
const passport = require("passport");

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
