const express = require('express')
const {
    getAll,
    getNFTByNftId,
    getNFTByUserId,
    create,
    getNFTByUserName,
    // getAllNFTS,
    getRecentlyCreatedNFTS,
    mintNFT,
    approveNFT,
    getNFTViews,
    banNFT,
    unbanNFT,
    getallCollections,
    oldNFt
} = require('../controllers/nft.controller')
const { uploadToPinata } = require('../controllers/pinata-upload')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const imageUpload = require('../middleware/image-upload')

// router.route("/nfts").get(getAllNFTS
router.route('/banNFT').post(banNFT)
router.route('/unbanNFT').post(unbanNFT)
router.route('/getAllExplore/:skip').get(getAll)
router.route('/getallCollections/:skip').get(getallCollections)
router.route("/create").post(authenticateUser, create);  
router.route("/getNFTViews/:nftId").get(getNFTViews);
router.route('/getNFTByUserId/:userId').get(getNFTByUserId)
router.route("/getNftById/:chain/:userId/:tokenId").get(getNFTByNftId);
router.route('/getNFTByUserName').post(getNFTByUserName)
router.route('/mint').post(authenticateUser, mintNFT)
// router.route("/getNftBids/:id").get(getNftBids);
router.route("/approve").post(authenticateUser, approveNFT);

router.route("/getRecent/:chain").get(getRecentlyCreatedNFTS);
router.route('/approve').post(authenticateUser, approveNFT)

router
  .route("/upload-pinata")
  .post(imageUpload.single("image"), uploadToPinata);

  router.route("/old").get(oldNFt)
module.exports = router
