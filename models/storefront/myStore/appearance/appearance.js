const mongoose = require("mongoose");

const AppearanceSchema = new mongoose.Schema(
  {
    colorPalette: {
      value: String,
      label: String
    },
    enableDarkMode: {
      type: Boolean,
    },
    heading: {
      type: String,
    },
    headerDescription:{
      type: String
    },
    headerButton:[{
      title:String,
      link:String,
      newTab: Boolean,
      style:String,
      show:Boolean
    }],
    featuredAssets:[{
      name:String,
      link:String
    }],
    showFooter:{
      type: Boolean
    },
    showGettingStarted:{
      type: Boolean
    },
    storeLoader:{
      type: String
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appearance", AppearanceSchema);
