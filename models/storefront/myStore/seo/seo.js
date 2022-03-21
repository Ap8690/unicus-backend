const mongoose = require("mongoose");

const SeoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
    },
    metaKeyword: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    favicon: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    metaTags: {
      type: String,
    },
    robotTxt: {
      type: String,
    },
    excludeSite: {
      type: Boolean,
    },
    sitemapHtml: {
      type: Boolean,
    },
    sitemapXml: {
      type: Boolean,
    },
    sitemapPagesXml: {
      type: Boolean,
    },
    nftCollectionXml: {
      type: Boolean,
    },
    nftItemsXml: {
      type: Boolean,
    },
    usersXml: {
      type: Boolean,
    },
    collectionRSSTitle: {
      type: String,
    },
    collectionRSSUrl: {
      type: String,
    },
    collectionRSSDescription: {
      type: String,
    },
    showCollectionFeed: {
      type: Boolean,
    },
    assetsRSSTitle: {
      type: String,
    },
    assetsRSSUrl: {
      type: String,
    },
    assetsRSSDescription: {
      type: String,
    },
    showAssetsFeed: {
      type: Boolean,
    },
    showAssetsSchema:{
      type: Boolean
    },
    showCollectionSchema:{
      type: Boolean
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seo", SeoSchema);
