const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const middle = require("../middleware/authPermission");
router.get("/", middle.checkLogged, homeController.index);

router.get("/login", homeController.login);
router.get("/admin", middle.checkAdmin, homeController.admin);

module.exports = router;
