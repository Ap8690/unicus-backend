const {
  getAppearance,
  updateAppearance
} =require("../../../controllers/settings/myStore/appearance.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticateUser, getAppearance);

router.route("/").post(authenticateUser, updateAppearance);

module.exports = router;
