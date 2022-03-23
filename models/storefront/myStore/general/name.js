const mongoose = require("mongoose");
const validator = require("validator");


const NameLogoSchema = new mongoose.Schema(
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
   
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NameLogo", NameLogoSchema);
