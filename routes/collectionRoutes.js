const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const { searchCollection, getCollections,getCollectionDetails, getallCollections } = require("../controllers/collection.controller");

router.route("/search/:limit/:skip").get(authenticateUser, searchCollection);
router.route("/getCollections/:limit/:skip/:collectionId").get(getCollections);
router.route("/getCollectionDetails/:id").get(getCollectionDetails);
router.route("/getallCollections/:limit/:skip").get(getallCollections);

module.exports = router;