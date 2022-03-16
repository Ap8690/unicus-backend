const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema(
  {
    showEth: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assetsMinted: {
        type: Boolean,
        default: false,
      },
    },
    showPoly: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assetsMinted: {
        type: Boolean,
        default: false,
      },
    },
    showBinance: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assetsMinted: {
        type: Boolean,
        default: false,
      },
    },
    showCronos: {
      type: {
        type: Boolean,
        default: false,
      },
    },
    showSellerKyc: {
      type: Boolean,
      default: false,
    },
    showBuyerKyc: {
      type: Boolean,
      default: false,
    },
    
    nftCategories: [
      {
        id: mongoose.Schema.Types.ObjectId,
        category: String,
        enabled: Boolean,
      },
    ],
    siteUrls: [{ url: String, isPrimary: Boolean }],
    privacyPolicy: {
      type: String,
      default: "",
    },
    terms: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Advance", AdvanceSchema);
