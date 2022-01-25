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
  getAuctionByTokenId,
  buy,
  endAuction,
  getAllExplore,
  cancelAuction,
  getAuctionById,
  addViews,
} = require("../controllers/auction.controller");

router.route("/sell").post(authenticateUser, sell);
router.route("/buy").post(authenticateUser, buy);
router.route("/getAuctionById/:id").get(getAuctionById);
router.route("/getAuctionByTokenId/:tokenId").get(getAuctionByTokenId);

router.route("/getAllSale/:skip/:chain").get(getAllSale);
router.route("/getAllAuction/:skip/:chain").get(getAllAuction);
router.route("/getAllExplore/:skip/:chain").get(getAllExplore);
router.route("/create").post(authenticateUser, create);
router.route("/start").post(authenticateUser, startAuction);
router.route("/placeBid").post(authenticateUser, placeBid);
router.route("/end").post(authenticateUser, endAuction);
router.route("/cancel").post(authenticateUser, cancelAuction);
router.route("/addView").post(addViews);

module.exports = router;
