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
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
