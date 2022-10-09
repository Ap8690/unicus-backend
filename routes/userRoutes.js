const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    removeWallet,
    updateBackgroundPicture,
    addWallet,
    updateUser,
    getUserById,
    getGlobalSearch,
    updateProfilePicture,
    getUserNonceByAddress,
    unbanUser,
    banUser,
    getMyProfile
} = require('../controllers/user.controller')
const {uploadImageToS3} = require("../services/s3_upload")

router.route('/banUser').post(banUser)

router.route('/unbanUser').post(unbanUser)

router.route('/getAllUsers/:skip').get(getAllUsers)

router.route('/update/updateUser').post(authenticateUser, updateUser)

router.route('/getSingleUser/:token').get(authenticateUser, getSingleUser)

router
    .route('/update/profilePicture')
    .post(authenticateUser,uploadImageToS3().fields([
        { name: "file", maxCount: 1 },
      ]), updateProfilePicture)

router
    .route('/update/backgroundPicture')
    .post(authenticateUser,uploadImageToS3().fields([
        { name: "file", maxCount: 1 },
      ]), updateBackgroundPicture)

router.route('/getUserById/:id').get(getUserById) // No Auth
router.route('/getUserProfile').get(authenticateUser,getMyProfile) 

router.route('/addWallet/:walletAddress').get(authenticateUser, addWallet)

router.route('/removeWallet/:walletAddress').get(authenticateUser, removeWallet)

router.route('/nonce/:publicAddress').get(getUserNonceByAddress)

router.route('/globalSearch/:search').get(getGlobalSearch)

module.exports = router
