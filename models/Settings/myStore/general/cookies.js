const mongoose = require("mongoose");

const CookiesSchema = new mongoose.Schema(
  {
    showCookieConsent: {
      type: Boolean,
    },
    cookieConsentText: {
      type: String,
    },
    infoLink: {
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

module.exports = mongoose.model("CookiesConsent", CookiesSchema);
