const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middle = require("../middleware/authPermission");
const passport = require("../middleware/middlePassport");
const multer = require("multer");
const fs = require("fs-extra");
var upload = multer({ dest: "uploads/" });

router.get("/", middle.checkLogged, userController.checkUser);

router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true,
  })
);
router.post(
  "/",
  middle.checkLogged,
  middle.checkAdmin,
  userController.createAcc
);
router.post(
  "/edit",
  middle.checkLogged,
  middle.checkAdmin,
  userController.classifyPost
);
router.post("/editinfor", middle.checkLogged, userController.editInfor);
router.get("/changeForm", userController.changeForm);
router.post(
  "/editavatar",
  middle.checkLogged,
  upload.single("avatar"),
  userController.editAvatar
);
router.get("/logout", userController.logout);
router.get("/changeForm", userController.changeForm);
router.post("/changepassword", middle.checkLogged, userController.changePass);
module.exports = router;
