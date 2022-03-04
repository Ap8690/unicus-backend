const {
  getSeo,
  updateSeo,
} =require( "../../../controllers/settings/myStore/seo.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(authenticateUser, getSeo);

router.route("/").post(authenticateUser, updateSeo);

module.exports = router;
