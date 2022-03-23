const mongoose = require("mongoose");

const BasicSettingsSchema = new mongoose.Schema(
  {
    showInSuperMarket: {
      type: Boolean,
    },
    marketPlaceAsHome: {
      type: Boolean,
    },
    showLanguage: {
      type: Boolean,
    },
    locale: {
      type: String,
    },
    timeZone: {
      type: String,
    },
    dateFormat: {
      type: String,
    },
    timeFormat: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BasicSettings", BasicSettingsSchema);
