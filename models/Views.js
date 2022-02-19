const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema(
  {
    views: { type: [], default: [] },
    hearts: { type: [], default: [] },
    nftId: {
      type: mongoose.Types.ObjectId,
      ref: "Nft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Views", NftSchema);
