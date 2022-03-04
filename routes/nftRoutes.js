const { uploadToPinata } =require("../controllers/pinata-upload");

const express = require("express");
const {
  getAll,
  getRecentlyCreatedNFTS,
  getNFTByNftId,
  getNFTByUserId,
  create,
  getNftStates,
  getNFTByUserName,
  getNftBids,
  // getAllNFTS,
  mintNFT,
  approveNFT,
} = require("../controllers/nft.controller");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const imageUpload = require("../middleware/image-upload");

// router.route("/nfts").get(getAllNFTS)
router.route("/getAllExplore/:skip/:chain").get(getAll)
router.route("/create").post(authenticateUser, create);  
router.route("/getRecent/:chain").get(getRecentlyCreatedNFTS);
router.route("/getNFTByUserId/:userId").get(authenticateUser, getNFTByUserId);
router.route("/getNFTByUserName").get(authenticateUser,getNFTByUserName);
router.route("/mint").post(authenticateUser, mintNFT);

router.route("/getNftBids/:id").get(getNftBids);
router.route("/approve").post(authenticateUser, approveNFT);
router.route("/:nftId").get(getNFTByNftId);

router
  .route("/upload-pinata")
  .post(imageUpload.single("image"), uploadToPinata);

module.exports = router;
