const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  create,
  startAuction,
  placeBid,
  endAuction,
  cancelAuction,
  addViews,
} = require("../controllers/auction.controller");

router.route("/create").post(authenticateUser, create);
router.route("/start").post(authenticateUser, startAuction);
router.route("/placeBid").post(authenticateUser, placeBid);
router.route("/end").post(authenticateUser, endAuction);
router.route("/cancel").post(authenticateUser, cancelAuction);
router.route("/addView").post(authenticateUser, addViews);

module.exports = router;
