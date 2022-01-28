const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenPayload } = require("../utils");
const Web3 = require("web3");
var cloudinary = require('cloudinary');
const { Bids, NFTStates, Nft, Auction } = require("../models");
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

  var regex = new RegExp(`^${walletAddress.trim()}$`, "ig");
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
    const user = await User.findOne({ wallets: { $regex : new RegExp(walletAddress.trim(), "i") }}, { nonce: 1 });
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
    cloudinary.v2.uploader.destroy(`Unicus_User/${profileToken}`, function(error,result) {
      console.log(result, error) 
    });
  }
  await User.updateOne(
    { _id: userId }, 
    { profileUrl: req.body.cloudinaryUrl }
  );
  const finalUser = await User.findOne({ _id: userId });
  res.status(StatusCodes.OK).json({ user: finalUser });
};

const updateBackgroundPicture = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findOne({ _id: userId });
  var backgroundToken
  if(user.backgroundUrl) {
    const length = user.backgroundUrl.split("/").length
    backgroundToken = user.backgroundUrl.split("/")[length - 1].split(".")[0]
    cloudinary.v2.uploader.destroy(`Unicus_User/${backgroundToken}`, function(error,result) {
      console.log(result, error) 
    });
  }
  await User.updateOne(
    { _id: userId }, 
    { backgroundUrl: req.body.cloudinaryUrl }
  );
  const finalUser = await User.findOne({ _id: userId });
  res.status(StatusCodes.OK).json({ user: finalUser });
};

const updateUser = async (req, res) => {
  const { username, facebook, linkedIn, twitter, instagram, bio, discord } = req.body;

  if (!username) {
    throw new CustomError.BadRequestError("Please provide the username");
  } else if (!bio) {
    throw new CustomError.BadRequestError("Please provide the bio");
  }

  const user = await User.findOne({ _id: req.user.userId });

  // if(username.toLowerCase().trim() !== user.username.toLowerCase().trim()) {
    const nfts = await Nft.updateMany({ owner: req.user.userId }, { userInfo: username })
    await Auction.updateMany({ sellerId: req.user.userId }, { sellerInfo: username })
    await Bids.updateMany({ bidder: req.user.userId }, { username: username })
    await NFTStates.updateMany({ from: user.username }, { from: username })
    await NFTStates.updateMany({ to: user.username }, { to: username })
  // }

  user.username = username;
  user.facebook = facebook;
  user.discord = discord;
  user.linkedIn = linkedIn;
  user.twitter = twitter;
  user.instagram = instagram;
  user.bio = bio;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "user updated", nfts });
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
