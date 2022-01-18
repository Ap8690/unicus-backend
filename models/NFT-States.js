const mongoose = require("mongoose");

const NftStateSchema = new mongoose.Schema(
  {
    nftId: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
      required: true,
    },
    state: { type: String }, // Mint, Transfer
    price: { type: Number },
    date: { type: Date },
    from: { type: String }, // Public address
    to: { type: String }, // Public Address
  },
  { timestamps: true }
);

module.exports = mongoose.model("NftStates", NftStateSchema);
