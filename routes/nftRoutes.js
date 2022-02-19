const express = require('express')
const {
    getAll,
    getNFTByNftId,
    getNFTByUserId,
    create,
    getNftStates,
    getNFTByUserName,
    getNftBids,
    // getAllNFTS,
    mintNFT,
    approveNFT,
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
router.route('/:nftId').get(getNFTByNftId)
router.route('/getNFTByUserId/:userId').get(getNFTByUserId)
router.route('/getNFTByUserName').post(getNFTByUserName)
router.route('/mint').post(authenticateUser, mintNFT)

router.route('/getNftStates/:id').get(getNftStates)
router.route('/getNftBids/:id').get(getNftBids)
router.route('/approve').post(authenticateUser, approveNFT)

module.exports = router
