const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NFT name is required"],
    },
    imageHash: { type: String, required: [true, "Image Hash required"] },
    jsonHash: { type: String, required: [true, "JSON Hash required"] },
    imageUrl: { type: String, required: [true, "Image URL required"] },
    nftType: {
      type: String,
      enum: {
        values: ["image", "audio", "video"],
        message: `{VALUE} is not supported`,
      },
      default: "image",
    },
    description: {
      type: String,
      required: [true, "Nft description is required"],
    },
    tags: [String],
    isApproved: { type: Boolean, default: false },
    approvedAt: Date,
    approveHash: String,
    blockNumber: Number,
    mintHash: String,
    mintReceipt: {},
    tokenId: Number,
    auctionId: Number,
    views: { type: Number, default: 0 },
    uploadedBy: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    mintedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    chain: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nft", NftSchema);
