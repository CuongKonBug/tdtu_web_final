const express = require("express");
const router = express.Router();
const informController = require("../controllers/informController");
const middle = require("../middleware/authPermission");

router.get("/", middle.checkLogged, informController.notify);
router.post(
  "/",
  middle.checkLogged,
  middle.checkFaculty,
  informController.createNotify
);
router.get("/api", informController.returnNotify);
router.get(
  "/delete/:id",
  middle.checkLogged,
  middle.checkFaculty,
  informController.deleteNotify
);
router.post(
  "/edit",
  middle.checkLogged,
  middle.checkFaculty,
  informController.editNotify
);
module.exports = router;
