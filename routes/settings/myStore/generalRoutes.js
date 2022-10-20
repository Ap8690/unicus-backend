const {
    getGeneral,
    getSocialLinks,
    updateGeneral,
    updateSocialLinks,
    uploadLogo,
} = require("./../../../controllers/settings/myStore/general.controller");
const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const { auth } = require("../../../utils/nodemailerConfig");
const router = express.Router();
const { uploadImageToS3 } = require("../../../services/s3_upload");

router.route("/").get(getGeneral);
router.route("/socialLinks").get(getSocialLinks);

router.route("/").post(authenticateUser, updateGeneral);
router.route("/socialLinks").post(authenticateUser, updateSocialLinks);
router
    .route("/logo/upload")
    .post(
        authenticateUser,
        uploadImageToS3().fields([{ name: "logo", maxCount: 1 }]),
        uploadLogo
    );

module.exports = router;
