const { authenticateUser } = require("../middleware/authentication");
const {
  createStore,
  getStoreByUser,
  getStoreDetails,
} = require("../controllers/storefront.controller");
const express = require("express");
const router = express.Router();

router.route("/create").post(authenticateUser, createStore);
router.route("/getStoreByUser").get(authenticateUser, getStoreByUser)
router.route("/").get(getStoreDetails)
module.exports = router;
