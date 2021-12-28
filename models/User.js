const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    username: {
      type: String,
      unique: [true, "username has already taken"],
      minlength: [3, "Username should have at least 3 characters"],
      maxlength: [50, "Username cannot have more than 50 characters"],
    },
    email: {
      type: String,
      unique: [true, "Email has already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    profileUrl: {
      type: String,
    },
    password: {
      type: String,
      minlength: [6, "Password minimum length should be of 6 digits"],
    },
    userType: {
      type: Number,
      enum: [1, 2], //1- Non Crypto & 2- Crypto User
      default: 1,
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedOn: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    wallets: {
      type: [],
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    nonce: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
