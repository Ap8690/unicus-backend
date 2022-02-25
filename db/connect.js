const mongoose = require("mongoose");
const CustomError = require("../errors");

const connectDB = (url) => {
  if (!url)
    throw new CustomError.BadRequestError(
      "Please provide db connection string"
    );
    else{
      console.log("Db connected");
    }

  return mongoose.connect(url);
};

module.exports = connectDB;
