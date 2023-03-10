const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    auctionType: {
      type: String, //sale, auction
      required: true,
    },
    auctionId: {
      type: Number,
      required: true,
    },
    auctionTimer: {
      type: Date,
      default: 0,
    },
    auctionStatus: {
      type: Number,
      enum: { values: [1, 2, 3, 4], message: `{VALUE} is not a valid` }, // 1- Auction Created,2- Auction Started, 3-Auction Finished, 4- Auction Cancelled
      default: 1,
    },
    auctionStartOn: Date,
    auctionStartTxnHash: String,
    auctionEndedOn: Date,
    auctionEndTxnHash: String,
    auctionCancelledOn: Date,
    auctionCancelTxnHash: String,
    tokenId: Number,
    nftId: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
    },
    chain: String,
    lastBid: {
      type: Number,
      default: 0,
    },
    lastBidId: {
      type: mongoose.Types.ObjectId,
      ref: "Bids",
    },
    highestBidder: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    bidsPlaced: {
      type: Number,
      default: 0,
    },
    startBid: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
    sellerInfo: {
      type: String,
    },
    sellerWallet: {
      type: String,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
    cloudinaryUrl: {
      type: String,
    },
    auctionWinner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", AuctionSchema);
