const mongoose = require("mongoose");
const validator = require("validator");

const GeneralSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: [true, "Store Name is required"] },
    email: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    country: { type: String, required: false },
    logoUrl: { type: String, required: false },
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
    showNewsLetter: {
      type: Boolean,
    },
    showContactUs: {
      type: Boolean,
    },
    phone: {
      type: String,
    },
    contactEmail: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    address: {
      type: String,
    },
    showCookieConsent: {
      type: Boolean,
    },
    cookieConsentText: {
      type: String,
    },
    infoLink: {
      type: String,
    },
    storeFees: {
      type: String,
    },
    secondaryStoreFees: {
      type: String,
    },
    storeWallet: {
      type: String,
    },
    socialLinks: {
      type: mongoose.Types.ObjectId,
      ref: "SocialLink",
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

module.exports = mongoose.model("General", GeneralSchema);
