const Nft = require("../models/Nft");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
  console.log("cretae")
  const { imageIpfs, jsonIpfs, name, description, imageUrl, nftType } =
    req.body;

  if (!imageIpfs) {
    throw new CustomError.BadRequestError("Please provide the image IPFS");
  } else if (!jsonIpfs) {
    throw new CustomError.BadRequestError("Please provide the json IPFS");
  } else if (!name) {
    throw new CustomError.BadRequestError("Please provide the nft name");
  } else if (!description) {
    throw new CustomError.BadRequestError("Please provide the nft description");
  } else if (!imageUrl) {
    throw new CustomError.BadRequestError("Please provide the url");
  } else if (!nftType) {
    throw new CustomError.BadRequestError("Please provide the nft type");
  }

  const nft = await Nft.findOne({ imageHash: imageIpfs });
  if (nft) {
    throw new CustomError.BadRequestError("NFT already exists");
  }

  const uploadedBy = req.user.userId;
  const createObj = {
    imageHash: imageIpfs,
    jsonHash: jsonIpfs,
    name,
    description,
    imageUrl,
    nftType,
    uploadedBy,
  };

  const data = await Nft.create(createObj);
  res.status(StatusCodes.CREATED).json({ data });
};

const get = async (req, res) => {
  const nftId = req.params.id;

  if (!nftId)
    throw new CustomError.BadRequestError("Please provide the NFT id");

  const nft = await Nft.aggregate([
    {
      $match: {
        _id: ObjectId(nftId),
      },
    },
    {
      $lookup: {
        from: "Bids",
        let: { bidId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$nftId", "$$bidId"] } } },
          { $sort: { createdAt: -1 } },
        ],
        as: "Bids",
      },
    },
    {
      $lookup: {
        from: "NftStates",
        let: { nftId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$nftId", "$$nftId"] } } },
          { $sort: { createdAt: -1 } },
        ],
        as: "states",
      },
    },
  ]);

  if (!nft.length) throw new CustomError.NotFoundError(`Invalid Nft`);

  res.status(StatusCodes.OK).json({ data: nft });
};

const getAll = async (req, res) => {
  const nfts = await Nft.find({});
  res.status(StatusCodes.OK).json({ data: nfts });
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
    console.log(updateNFT);
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

module.exports = { create, get, getAll, mintNFT, approveNFT };
