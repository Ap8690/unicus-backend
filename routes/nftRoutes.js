const express = require('express')
const {
    getAll,
    getNFTByNftId,
    getNFTByUserId,
    create,
    getNFTByUserName,
    // getAllNFTS,
    mintNFT,
    approveNFT,
    getNFTViews,
    banNFT,
    unbanNFT,
} = require('../controllers/nft.controller')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const imageUpload = require('../middleware/image-upload')
const { uploadToPinata } = require('../middleware/upload-pinata')

// router.route("/nfts").get(getAllNFTS
router.route('/banNFT').post(banNFT)
router.route('/unbanNFT').post(unbanNFT)
router.route('/getAllExplore/:skip').get(getAll)
router.route('/').post(authenticateUser, create)
router.route("/getNFTViews/:nftId").get(getNFTViews);
router.route('/getNFTByUserId/:userId').get(getNFTByUserId)
router.route("/getNftById/:tokenId/:userId").get(getNFTByNftId);
router.route('/getNFTByUserName').post(getNFTByUserName)
router.route('/mint').post(authenticateUser, mintNFT)

router.route('/approve').post(authenticateUser, approveNFT)

module.exports = router
