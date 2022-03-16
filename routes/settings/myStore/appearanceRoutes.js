const {
  getAppearance,
  updateAppearance,
  getStoreLoader
} =require("../../../controllers/settings/myStore/appearance.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(getAppearance);
router.route("/getStoreLoader").get(getStoreLoader);


router.route("/").post(authenticateUser, updateAppearance);

module.exports = router;
