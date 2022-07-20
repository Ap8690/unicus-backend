const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
    },
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

module.exports = mongoose.model("Collection", CollectionSchema);
