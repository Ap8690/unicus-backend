const express = require("express");
const {
  getAll,
  getNFTByNftId,
  getNFTByUserId,
  create,
  getNFTByUserName,
  mintNFT,
  approveNFT,
} = require("../controllers/nft.controller");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const imageUpload = require("../middleware/image-upload");
const { uploadToPinata } = require("../middleware/upload-pinata");

router
  .route("/")
  .get(authenticateUser, getAll)
  .post(authenticateUser, create);
router.route("/:nftId").get(getNFTByNftId);
router.route("/getNFTByUserId/:userId").get(getNFTByUserId);
router.route("/getNFTByUserName").post(getNFTByUserName);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);

module.exports = router;
