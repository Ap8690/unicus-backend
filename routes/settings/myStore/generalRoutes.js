const { getGeneral, getSocialLinks, updateGeneral, updateSocialLinks} =require( "./../../../controllers/settings/myStore/general.controller");
const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const { auth } = require("../../../utils/nodemailerConfig");
const router = express.Router();

router.route("/").get(authenticateUser, getGeneral )
router.route("/socialLinks").get(getSocialLinks);

router.route("/").post(authenticateUser, updateGeneral);
router.route("/socialLinks").post(authenticateUser, updateSocialLinks);

module.exports = router;
