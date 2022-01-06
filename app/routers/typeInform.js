const express = require("express");
const router = express.Router();
const typeInformController = require("../controllers/typeInformController");
const middle = require("../middleware/authPermission");
const multer = require("multer");
const fs = require("fs-extra");
var upload = multer({ dest: "uploads/" });

router.post(
  "/",
  middle.checkLogged,
  middle.checkAdmin,
  typeInformController.Inform
);

module.exports = router;
