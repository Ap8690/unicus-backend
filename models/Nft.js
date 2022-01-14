const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NFT name is required"],
    },
    imageHash: { type: String, required: [true, "Image Hash required"] },
    jsonHash: { type: String, required: [true, "JSON Hash required"] },
    nftType: {
      type: String,
    },
    description: {
      type: String,
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
    nftStatus: {
      type: Number,
      enum: { values: [1, 2, 3], message: `{VALUE} is not a valid` }, // 1- NFT In wallet,2- NFT on Sale, 3- NFT on Auction
      default: 1,
    },
    chain: {
      type: Number,
    },
    royalty: {
      type: Number,
    },
    category: {
      type: String,
    },
    collectionName: {
      type: String,
    },
    cloudinaryUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nft", NftSchema);
