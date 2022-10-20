const { authenticateUser } = require("../middleware/authentication");
const {
    createStore,
    getStoreByUser,
    getStoreDetails,
} = require("../controllers/storefront.controller");
const express = require("express");
const router = express.Router();
const { uploadImageToS3 } = require("../services/s3_upload");

router
    .route("/create")
    .post(
        authenticateUser,
        uploadImageToS3().fields([{ name: "logoUrl", maxCount: 1 }]),
        createStore
    );
router.route("/getStoreByUser").get(authenticateUser, getStoreByUser);
router.route("/").get(getStoreDetails);
module.exports = router;
