const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema(
  {
    showEth: {
      type: Boolean,
    },
    showPoly: {
      type: Boolean,
    },
    showBinance: {
      type: Boolean,
    },
    showCronos: {
      type: Boolean,
    },
    showSeller: {
      type: Boolean,
    },
    showBuyer: {
      type: Boolean,
    },
    nftCategories: [{ category: String, enabled: Boolean }],
    siteUrls: [{ url: String, isPrimary: Boolean }],
    privacyPolicy: {
      type: String,
    },
    terms: {
      type: String,
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
