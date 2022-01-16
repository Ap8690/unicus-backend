const Nft = require("../models/Nft");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
  const { jsonIpfs, name, nftType, description, chain, tokenId, mintedBy, collectionName, category, royalty, cloudinaryUrl,owner, uploadedBy } =
    req.body;
    const jk = "kkdskds"
  console.log(req, req.body)
  if (!jsonIpfs) {
    throw new CustomError.BadRequestError("Please provide the json IPFS");
  } else if (!name) {
    throw new CustomError.BadRequestError("Please provide the nft name");
  } else if (!nftType) {
    throw new CustomError.BadRequestError("Please provide the nft type");
  }

  const createObj = {
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
    cloudinaryUrl,
    royalty, 
    owner
  };

  const data = await Nft.create(createObj);
  res.status(StatusCodes.CREATED).json({ data });
};

const getNFTByTokenId = async (req, res) => {
  const tokenId = req.params.tokenId;
  console.log(tokenId)
  const nft = await Nft.findOne({
    tokenId
  });
  console.log(nft)
  res.status(StatusCodes.OK).json({ nft });
};

const getAll = async (req, res) => {
  const userId = req.user.userId;
  const nfts = await Nft.find({ owner: userId });
  res.status(StatusCodes.OK).json({ data: nfts });
};

const getNFTByUserId = async (req, res) => {
  const userId = req.params.userId;
  const nfts = await Nft.find({ owner: userId,  });
  res.status(StatusCodes.OK).json(nfts);
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

module.exports = { create, getNFTByTokenId, getAll, mintNFT, approveNFT, getNFTByUserId };
