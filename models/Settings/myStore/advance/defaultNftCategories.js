const mongoose = require("mongoose");

const DefaultNftCategorySchema = new mongoose.Schema(
  {
    nftCategories: [
      {
        category: String,
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
    owner: {
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

module.exports = mongoose.model(
  "DefaultNftCategory",
  DefaultNftCategorySchema
);
