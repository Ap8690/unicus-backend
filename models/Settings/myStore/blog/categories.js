const mongoose = require("mongoose");

const BlogCategorySchema = new mongoose.Schema(
  {
    categories: [
      {
        title: String,
        status: String,
        date: String,
        manage: String,
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

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
