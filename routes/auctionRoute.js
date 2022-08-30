const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  sell,
  getAllSale,
  getAllAuction,
  create,
  startAuction,
  placeBid,
  getAuctionByNftId,
  getRecentPurchased,
  buy,
  endAuction,
  getAllExplore,
  cancelAuction,
  getAuctionById,
  addViews,getAuctions
} = require("../controllers/auction.controller");

router.route("/sell").post(authenticateUser, sell);
router.route("/buy").post(authenticateUser, buy);
router.route("/getAuctionById/:tokenId/:chain").get(getAuctionById);
router.route("/getAuctionByNftId/:NftId").get(getAuctionByNftId);
router.route("/getAllSale/:skip/:chain").get(getAllSale);
router.route("/getAllAuction/:skip/:chain/:sort").get(getAllAuction);
router.route("/getAllExplore/:skip/:chain/:sort").get(getAllExplore);
router.route("/getRecentPurchased/:chain").get(getRecentPurchased);
router.route("/create").post(authenticateUser, create);
router.route("/start").post(authenticateUser, startAuction);
router.route("/placeBid").post(authenticateUser, placeBid);
router.route("/end").post(authenticateUser, endAuction);
router.route("/cancel").post(authenticateUser, cancelAuction);
router.route("/addView").post(addViews);
router.route("/getAuctions/:number/:auctionType").get(getAuctions);

module.exports = router;
