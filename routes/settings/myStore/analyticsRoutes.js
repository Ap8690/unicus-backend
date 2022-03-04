const {
  getAnalytics, updateAnalytics
} =require("../../../controllers/settings/myStore/analytics.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticateUser, getAnalytics);

router.route("/").post(authenticateUser, updateAnalytics);

module.exports = router;
