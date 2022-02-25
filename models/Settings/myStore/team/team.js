const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    members: [
      {
        name: String,
        ethAddress: String,
        role: { value: String, label: String },
      },
    ],
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

module.exports = mongoose.model("Team", TeamSchema);
