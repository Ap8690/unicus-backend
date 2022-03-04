const {
  getNotificationSetting,
  updateNotificationSetting,
} =require("../../../controllers/settings/myAccount/my-account.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticateUser, getNotificationSetting);

router.route("/").post(authenticateUser, updateNotificationSetting);

module.exports = router;
