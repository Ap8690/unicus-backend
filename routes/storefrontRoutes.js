const { authenticateUser } = require("../middleware/authentication");
const { createStore } = require("../controllers/storefront.controller");
const express = require("express");
const router = express.Router();

router.route("/").post(authenticateUser, createStore);

module.exports = router;
