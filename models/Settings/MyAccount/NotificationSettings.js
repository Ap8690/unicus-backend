const mongoose = require("mongoose");

const NotificationSettingSchema = new mongoose.Schema(
  {
    itemSold: {
      type: Boolean,
      default: false,
    },
    bidActivity: {
      type: Boolean,
      default: false,
    },
    priceChange: {
      type: Boolean,
      default: false,
    },
    auctionExpiration: {
      type: Boolean,
      default: false,
    },
    outbid: {
      type: Boolean,
      default: false,
    },
    referralSuccessful: {
      type: Boolean,
      default: false,
    },
    ownedAssetUpdates: {
      type: Boolean,
      default: false,
    },
    successfulPurchase: {
      type: Boolean,
      default: false,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    minEth: {
      type: String,
      default: "",
    },
    minMatic: {
      type: String,
      default: "",
    },
    minBnb: {
      type: String,
      default:""
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "NotificationSetting",
  NotificationSettingSchema
);
