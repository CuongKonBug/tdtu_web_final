const express = require("express");
const router = express.Router();
const passport = require("../middleware/middlePassport");

router.route("/").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

module.exports = router;
