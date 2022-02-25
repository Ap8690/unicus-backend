const { getBasicSettings, getContactUs, getCookies, getNameLogo, getSocialLinks, getStoreFees, updateBasicSettings, updateContactUs, updateCookies, updateNameLogo, updateSocialLinks, updateStoreFees } =require( "./../../../controllers/storefront/myStore/general.controller");
const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/nameLogo").get(authenticateUser, getNameLogo )
router.route("/basicSettings").get(authenticateUser, getBasicSettings)
router.route("/cookies").get(authenticateUser, getCookies);
router.route("/socialLinks").get(authenticateUser, getSocialLinks);
router.route("/contactUs").get(authenticateUser, getContactUs);
router.route("/storeFees").get(authenticateUser, getStoreFees);

router.route("/nameLogo").post(authenticateUser, updateNameLogo);
router.route("/basicSettings").post(authenticateUser, updateBasicSettings);
router.route("/cookies").post(authenticateUser, updateCookies);
router.route("/socialLinks").post(authenticateUser, updateSocialLinks);
router.route("/contactUs").post(authenticateUser, updateContactUs);
router.route("/storeFees").post(authenticateUser, updateStoreFees);

module.exports = router;
