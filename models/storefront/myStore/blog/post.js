const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema(
  {
    posts: [
      {
        title: String,
        slug: String,
        status:String,
        date:String,
        manage:String
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostsSchema);
