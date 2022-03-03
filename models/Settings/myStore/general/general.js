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
      required: false,
    },
    country: { type: String, required: false, default: "" },
    logoUrl: { type: String, required: false, default: "" },
    showInSuperMarket: {
      type: Boolean,
      default: false,
    },
    marketPlaceAsHome: {
      type: Boolean,
      default: false,
    },
    showLanguage: {
      type: Boolean,
      default: false,
    },
    locale: {
      type: String,
      default: "",
    },
    timeZone: {
      type: String,
      default: "",
    },
    dateFormat: {
      type: String,
      default: "",
    },
    timeFormat: {
      type: String,
      default: "",
    },
    showNewsLetter: {
      type: Boolean,
      default: false,
    },
    showContactUs: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
      required: false,
    },
    address: {
      type: String,
      default: "",
    },
    showCookieConsent: {
      type: Boolean,
      default: false,
    },
    cookieConsentText: {
      type: String,
      default: "",
    },
    cookieInfoLink: {
      type: String,
      default: "",
    },
    storeFees: {
      type: String,
      default: "",
    },
    secondaryStoreFees: {
      type: String,
      default: "",
    },
    storeWallet: {
      type: String,
      default: "",
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
