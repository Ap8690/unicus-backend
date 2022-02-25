const mongoose = require("mongoose");

const SocialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    discord: {
      type: String,
    },
    pinterest: {
      type: String,
    },
    reddit: {
      type: String,
    },
    behance: {
      type: String,
    },
    telegram: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    twitter: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    youtube: {
      type: String,
    },
    dribble: {
      type: String,
    },
    stackoverflow: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLink", SocialLinksSchema);
