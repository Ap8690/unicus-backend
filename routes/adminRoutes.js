const express = require('express')
const router = express.Router()

const {
    dashboard,
    totalUsers,
    totalNfts,
    login,
    totalBids,
    totalNftStates,
    getAllAdmin,
    verifyEmail,
    changeUserStatus,
    deleteAdmin,
    register,
} = require('../controllers/admin.controller')

router.post('/login', login)
router.post('/register', register)
router.post('/verify-email', verifyEmail)
router.post('/deleteAdmin', deleteAdmin)
router.get('/dashboard', dashboard)
router.get('/users', totalUsers)
router.get('/nfts', totalNfts)
router.get('/bids', totalBids)
router.get('/nftStates', totalNftStates)
router.get('/getAllAdmin', getAllAdmin)
router.post('/editAdmin', changeUserStatus)

module.exports = router
