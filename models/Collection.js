const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    logoUrl: {
      type: String
    },
    bannerUrl: {
      type: String
    },
    description: {
      type: String
    },
    category: {
      type: String
    },
    websiteUrl: {
      type: String
    },
    twitterUrl: {
      type: String
    },
    discordUrl: {
      type: String
    },
    telegramUrl: {
      type: String
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
