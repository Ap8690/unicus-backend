const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenPayload } = require("../utils");
const Web3 = require("web3");
var web3 = new Web3();

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const token = await Token.findOne({ token: req.params.token })
  const user = await User.findOne({ _id: token.user }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getUserNonceByAddress = async (req, res) => {
  const walletAddress = req.params.publicAddress;
  const checkAddress = await web3.utils.isAddress(walletAddress);
  if (checkAddress) {
    const user = await User.findOne({ wallets: { $regex : new RegExp(walletAddress, "i") }}, { nonce: 1 });
    if (user) {
      res
        .status(StatusCodes.OK)
        .json({ walletAddress: walletAddress, nonce: user.nonce });
    } else {
      const randomString = crypto.randomBytes(10).toString("hex");
      const verifyNonce = await createHash(randomString);

      const wallets = [walletAddress];
      let createObj = {
        wallets,
        userType: 2,
        nonce: verifyNonce,
      };
      const newUser = await User.create(createObj);
      res
        .status(StatusCodes.CREATED)
        .json({ walletAddress: walletAddress, nonce: newUser.nonce });
    }
  } else {
    throw new CustomError.BadRequestError("Invalid Wallet Address");
  }
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, username } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError("Please provide an email");
  } else if (!username) {
    throw new CustomError.BadRequestError("Please provide the username");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.username = username;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  getUserNonceByAddress,
};
