const express = require('express');
const router = express.Router();

const {
  dashboard,
  totalUsers,
  totalNfts,
  login,
  totalBids,
  totalNftStates
} = require('../controllers/admin.controller');

router.post('/login', login);
router.get('/dashboard', dashboard);
router.get('/users', totalUsers);
router.get('/nfts', totalNfts);
router.get('/bids', totalBids);
router.get('/nftStates', totalNftStates);

module.exports = router;
