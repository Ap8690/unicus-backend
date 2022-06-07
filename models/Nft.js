const mongoose = require('mongoose')

const NftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NFT name is required"],
    },
    jsonHash: { type: String, required: [true, "JSON Hash required"] },
    nftType: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: {
      type: [],
    },
    isApproved: { type: Boolean, default: false },
    approvedAt: Date,
    approveHash: String,
    blockNumber: Number,
    mintHash: String,
    mintReceipt: {},
    tokenId: String,
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
      default:null
    },
    mintedInfo: {
      type: String,
    },
    userInfo: {
      type: String,
    },
    contractType: {
      type: String,
      enum: { values: ["721", "1155"], message: `{VALUE} is not a valid` }, // 721- 'ERC721', 1155- 'ERC1155'
      default: "721",
    },
    contractAddress: {
      type: String,
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
    active: {
      type: Boolean,
      default: true,
    },
    nonce: String,
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Nft', NftSchema)
