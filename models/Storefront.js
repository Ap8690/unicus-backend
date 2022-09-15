const mongoose = require("mongoose");

const StorefrontSchema = new mongoose.Schema(
  {
    domain: {
      type: [],
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    chainName: {
      type: String,
      default: "Ethereum"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Storefront", StorefrontSchema);