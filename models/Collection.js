const mongoose = require('mongoose')

const NftSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
    },
    description: {
      type: String,
    },
    views: { type: Number, default: 0 },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    backgroundUrl: {
      type: Number,
    },
    profileUrl: {
      type: Number,
    },
    total: {
      type: Number,
    },
    collectionName: {
      type: String,
    },
    floorPrice: {
      type: Number,
    },
    volumeTraded: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    discord: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', NftSchema)
