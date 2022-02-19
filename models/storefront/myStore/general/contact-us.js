const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    showNewsLetter: {
      type: Boolean,
    },
    showContactUs: {
      type: Boolean,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", ContactUsSchema);
