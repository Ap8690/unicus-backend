const express = require("express");
const {
  getAll,
  getNFTByNftId,
  getNFTByUserId,
  create,
  getNFTByUserName,
  mintNFT,
  approveNFT,
  getNFTViews
} = require("../controllers/nft.controller");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const imageUpload = require("../middleware/image-upload");
const { uploadToPinata } = require("../middleware/upload-pinata");

// router.route("/nfts").get(getAllNFTS)
router.route("/getAllExplore/:skip").get(getAll)
router.route("/").post(authenticateUser, create);  
router.route("/getNftById/:nftId/:userId").get(getNFTByNftId);
router.route("/getNFTByUserId/:userId").get(getNFTByUserId);
router.route("/getNFTViews/:nftId").get(getNFTViews);
router.route("/getNFTByUserName").post(getNFTByUserName);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);

module.exports = router;
