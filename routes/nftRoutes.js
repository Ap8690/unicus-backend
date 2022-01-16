const express = require("express");
const {
  getAll,
  getNFTByTokenId,
  getNFTByUserId,
  create,
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
router.route("/:tokenId").get(getNFTByTokenId);
router.route("/getNFTByUserId/:userId").get(getNFTByUserId);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);

module.exports = router;
