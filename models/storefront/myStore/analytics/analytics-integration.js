const mongoose = require("mongoose");

const AnalyticsIntegrationSchema = new mongoose.Schema(
  {
    mailChimp: {
      apiKey: String,
      userAcc: String,
      contactUs: String,
      subsForm: String,
    },
    madmimi: {
      username: String,
      apiKey: String,
      userAcc: String,
      contactUs: String,
      subsForm: String,
    },
    sendGrid: {
      fromEmail: String,
      apiKey: String,
    },
    googleAnalyticsUni: {
      type: String,
    },
    googleAnalyticsGA4: {
      type: String,
    },
    googleTagManager: {
      type: String,
    },
    mixpanel: {
      type: String,
    },
    facebookPixel: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnalyticsIntegration", AnalyticsIntegrationSchema);
