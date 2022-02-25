const mongoose = require("mongoose");

const StoreFeesSchema = new mongoose.Schema(
  {
    storeFees: {
      type: String,
    },
    secondaryStoreFees: {
      type: String,
    },
    storeWallet: {
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

module.exports = mongoose.model("StoreFees", StoreFeesSchema);
