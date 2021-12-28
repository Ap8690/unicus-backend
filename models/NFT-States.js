const mongoose = require("mongoose");

const NftStateSchema = new mongoose.Schema(
  {
    nftId: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
      required: true,
    },
    state: { type: String, required: true }, // Mint, Transfer
    from: { type: String, required: true }, // Public address
    to: { type: String }, // Public Address
  },
  { timestamps: true }
);

module.exports = mongoose.model("NftStates", NftStateSchema);
