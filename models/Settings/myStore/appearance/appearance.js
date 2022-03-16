const mongoose = require("mongoose");

const AppearanceSchema = new mongoose.Schema(
  {
    colorPalette: {
      type: String,
      default:"blue"
    },
    enableDarkMode: {
      type: Boolean,
      default:"true"
    },
    heading: {
      type: String,
      default:""
    },
    headerDescription: {
      type: String,
      default:""
    },
    headerButton: [
      {
        title: String,
        link: String,
        newTab: Boolean,
        style: String,
        show: Boolean,
      },
    ],
    featuredAssets: [
      {
        name: String,
        link: String,
      },
    ],
    showFooter: {
      type: Boolean,
      default: true
    },
    showGettingStarted: {
      type: Boolean,
      default: true
    },
    storeLoader: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    storefront: {
      type: mongoose.Types.ObjectId,
      ref: "Storefront",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appearance", AppearanceSchema);
