const Nft = require("../models/Nft");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const { Bids, Auction } = require("../models");
const ObjectId = mongoose.Types.ObjectId;
// import { v4 as uuidv4 } from 'uuid';

const create = async (req, res) => {
  const { jsonIpfs, name, nftType, description, chain, tokenId, mintedBy, collectionName, category, royalty, cloudinaryUrl,owner, uploadedBy, userInfo, tags } =
    req.body;
  const userId = req.user.userId;

  if (!jsonIpfs) {
    throw new CustomError.BadRequestError("Please provide the json IPFS");
  } else if (!name) {
    throw new CustomError.BadRequestError("Please provide the nft name");
  } else if (!nftType) {
    throw new CustomError.BadRequestError("Please provide the nft type");
  }

  const createObj = {
    userInfo,
    jsonHash: jsonIpfs,
    name,
    description,
    nftType,
    uploadedBy,
    chain, 
    tokenId, 
    mintedBy,
    collectionName,
    category,
    tags,
    cloudinaryUrl,
    royalty, 
    owner
  };

  const data = await Nft.create(createObj);
  console.log(data._id)
  await NFTStates.create({
    nftId: ObjectId(data._id),
    state: "Minted",
    from: "Null Address",
    to: userInfo,
    date: new Date()
  });
  res.status(StatusCodes.CREATED).json({ data });
};

const getNFTByNftId = async (req, res) => {
  const nftId = req.params.nftId;
  console.log(nftId)
  const nft = await Nft.findOne({
    _id: nftId
  });
  console.log(nft)
  res.status(StatusCodes.OK).json({ nft });
};

const getNftStates = async (req, res) => {
  const id = req.params.id
  console.log(id)
  const nftStates = await NFTStates.find({ nftId: id });
  
  res.status(StatusCodes.OK).json(nftStates);
};

const getNftBids = async (req, res) => {
  const id = req.params.id
  console.log(id)
  const bids = await Bids.find({ nftId: id });
  
  res.status(StatusCodes.OK).json(bids);
};

const getAll = async (req, res) => {
  const totalNfts = await Auction.find();
  console.log(totalNfts.length)
  if(totalNfts.length < skip + 5) {
    const limit = Math.max(0, totalNfts.length - skip)
    console.log(skip)
    const nfts = await Auction.find().limit(limit).skip(skip);
    res.status(StatusCodes.OK).json({ data: nfts, totalNfts: totalNfts.length });
  } else {
    const skip = Math.max(0, req.params.skip)
    console.log(skip)
    const nfts = await Auction.find().limit(5).skip(skip);
    res.status(StatusCodes.OK).json({ data: nfts, totalNfts: totalNfts.length });
  }
};

const getAllNFTS = async (req, res) => {
  const totalNfts = await Nft.find();
  console.log(totalNfts.length)
  if(totalNfts.length < skip + 5) {
    const limit = Math.max(0, totalNfts.length - skip)
    console.log(skip)
    const nfts = await Nft.find().limit(limit).skip(skip);
    res.status(StatusCodes.OK).json({ data: nfts, totalNfts: totalNfts.length });
  } else {
    const skip = Math.max(0, req.params.skip)
    console.log(skip)
    const nfts = await Nft.find().limit(5).skip(skip);
    res.status(StatusCodes.OK).json({ data: nfts, totalNfts: totalNfts.length });
  }
};

const getNFTByUserId = async (req, res) => {
  const userId = req.params.userId;
  const nfts = await Nft.find({ owner: userId,  });
  res.status(StatusCodes.OK).json(nfts);
};

const getNFTByUserName = async (req, res) => {
  const { username } = req.body;
  var user, nfts;
  var regex = new RegExp(`^${username}$`, "ig");
  if(username.length < 15) {
    user = await User.findOne({ username: { $regex : regex } });
    nftsOwned = await Nft.find({ owner: user._id });
    nftsMinted = await Nft.find({ mintedBy: user._id });
  } else {
    user = await User.findOne({ wallets: { $regex : regex } });
    nftsOwned = await Nft.find({ owner: user._id });
    nftsMinted = await Nft.find({ mintedBy: user._id });
  }
  res.status(StatusCodes.OK).json({nftsOwned, nftsMinted, user});
};

const mintNFT = async (req, res) => {
  const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body;

  if (!nftId) {
    throw new CustomError.BadRequestError(true, "Please provide NFT id");
  } else if (!mintHash) {
    throw new CustomError.BadRequestError(true, "Please provide the mint hash");
  } else if (!receipt) {
    throw new CustomError.BadRequestError(true, "Receipt is required");
  } else if (!blockNumber) {
    throw new CustomError.BadRequestError(true, "Please provide Block Number");
  } else if (tokenId != 0 && !tokenId) {
    throw new CustomError.BadRequestError(true, "Please provide token Id");
  } else {
    let updateObj = {
      mintHash,
      mintReceipt: receipt,
      blockNumber,
      tokenId,
      mintedBy: receipt.from,
    };

    await Nft.updateOne({ _id: ObjectId(nftId) }, updateObj);
    await NFTStates.create({
      nftId: ObjectId(nftId),
      state: "Mint",
      from: receipt.from,
      to: "contract",
    });
    res.status(StatusCodes.OK).send("NFT minted successfully");
  }
};

const approveNFT = async (req, res) => {
  const { nftId, approveHash } = req.body;
  if (nftId) {
    throw new CustomError.BadRequestError("Please provide the NFT id");
  } else if (!approveHash) {
    throw new CustomError.BadRequestError("Please provide the approve hash");
  } else {
    await Nft.updateOne(
      { _id: ObjectId(nftId) },
      { isApproved: true, approvedAt: new Date(), approveHash }
    );
    await NFTStates.create({
      nftId: ObjectId(nftId),
      state: "Approve",
      from: "address",
      to: "contract",
    });
    res.status(StatusCodes.Ok).send("NFT updated");
  }
};

module.exports = { create, getNFTByNftId, getAll, mintNFT, approveNFT, getNFTByUserId, getNftStates, getNFTByUserName, getNftBids };
