const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenPayload } = require("../utils");
const Web3 = require("web3");
var cloudinary = require('cloudinary');
var web3 = new Web3();

cloudinary.config({
  cloud_name: 'dhmglymaz',
  api_key: '519646171183911',
  api_secret: 'wztja-vWQOkLiqmHesfIfQSLZrE'
});

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const token = await Token.findOne({ token: req.params.token })
  const userId = req.user.userId;
  console.log(userId)
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getUserById = async (req, res) => {
  const userId = req.params.id
  console.log(userId)
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const addWallet = async (req, res) => {
  const walletAddress = req.params.walletAddress

  var regex = new RegExp(`^${walletAddress}$`, "ig");
    const walletAlreadyExists = await User.findOne({ wallets: { $regex : regex }});
    if (walletAlreadyExists) {
      throw new CustomError.BadRequestError(
        "User already exists with this wallet"
      );
    }

  const userId = req.user.userId;
  console.log(walletAddress, userId)

  const user = await User.updateOne(
    { _id: userId }, 
    {$push: {wallets: walletAddress}},{new: true, upsert: true }
  );

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

const updateProfilePicture = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findOne({ _id: userId });
  var profileToken
  if(user.profileUrl) {
    const length = user.profileUrl.split("/").length
    profileToken = user.profileUrl.split("/")[length - 1].split(".")[0]
    cloudinary.v2.uploader.destroy(`Unicus_56/${profileToken}`, function(error,result) {
      console.log(result, error) 
    });
  }
  await User.updateOne(
    { _id: userId }, 
    { profileUrl: req.body.cloudinaryUrl }
  );
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateBackgroundPicture = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findOne({ _id: userId });
  var backgroundToken
  if(user.backgroundUrl) {
    const length = user.backgroundUrl.split("/").length
    backgroundToken = user.backgroundUrl.split("/")[length - 1].split(".")[0]
    cloudinary.v2.uploader.destroy(`Unicus_56/${backgroundToken}`, function(error,result) {
      console.log(result, error) 
    });
  }
  await User.updateOne(
    { _id: userId }, 
    { backgroundUrl: req.body.cloudinaryUrl }
  );
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
  getUserById,
  addWallet,
  updateProfilePicture,
  updateBackgroundPicture,
  getUserNonceByAddress,
};
