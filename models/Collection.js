const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
      unique: true
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    logoUrl: {
      type: String,
      required: true
    },
    bannerUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
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
    instagramUrl: {
      type:String
    },
    linkedInUrl: {
      type:String
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
    total: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", CollectionSchema);
