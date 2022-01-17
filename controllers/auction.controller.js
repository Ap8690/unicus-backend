const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { Auction, Nft, Bids, NFTStates } = require("../models");
const {
  sendBidEmail,
  sendBidRefundEmail,
  sendAuctionSoldEmail,
  sendEndAuctionEmail,
} = require("../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
  try {
    const {
      nftId,
      auctionId,
      startBid,
      auctionType,
      auctionHash,
      tokenId,
      duration,
      chain,
      name,
      sellerWallet,
      sellerId,
      cloudinaryUrl
    } = req.body;
    var auctionTimer = new Date()
    const userId = req.user.userId;

    if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the NFT id");
    } else if (!auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!startBid) {
      throw new CustomError.BadRequestError("please provide the start bid");
    } else if (!auctionType) {
      throw new CustomError.BadRequestError("please provide the auction type");
    } else if (!auctionTimer) {
      throw new CustomError.BadRequestError("please provide the auction time");
    } else if (!auctionHash) {
      throw new CustomError.BadRequestError("please provide the auction hash");
    } else if (tokenId != 0 && !tokenId) {
      throw new CustomError.BadRequestError("Please provide the token id");
    } else if (!chain) {
      throw new CustomError.BadRequestError("Please provide the auction chain");
    } else {
      auctionTimer.setSeconds(auctionTimer.getSeconds() + duration)
      console.log(auctionTimer.toString())
      // const dateString = `${auctionTimer.getUTCDate} ++ ${auctionTimer.getUTCMonth + 1} ++ ${auctionTimer.getUTCFullYear} ++ ${auctionTimer.getUTCHours} ++ ${auctionTimer.getUTCMinutes}`
      let createObj = {
        nftId,
        auctionId,
        startBid,
        auctionType,
        auctionTimer,
        auctionStartOn: new Date(),
        auctionStartTxnHash: auctionHash,
        tokenId,
        highestBidder: userId,
        chain,
        auctionStatus: 1,
        name,
        sellerWallet,
        sellerId,
        cloudinaryUrl
      };
      const nftOne = await Nft.findOne({ _id: nftId });
      console.log(nftOne)
      const auction = await Auction.create(createObj)
      const nft = await Nft.updateOne(
        {
          _id: nftId
        },
        {
          owner: "61e031128ef7d9d1b48a4a7e",
          nftStatus: 3
        }
      );
      console.log(nft)
      res.status(StatusCodes.OK).json({auction, nft});
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const sell = async (req, res) => {
  try {
    const {
      nftId,
      auctionId,
      startBid,
      auctionType,
      auctionHash,
      tokenId,
      chain,
      name,
      sellerWallet,
      sellerId,
      cloudinaryUrl
    } = req.body;

    if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the NFT id");
    } else if (!auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!startBid) {
      throw new CustomError.BadRequestError("please provide the start bid");
    } else if (!auctionType) {
      throw new CustomError.BadRequestError("please provide the auction type");
    } else if (!auctionHash) {
      throw new CustomError.BadRequestError("please provide the auction hash");
    } else if (tokenId != 0 && !tokenId) {
      throw new CustomError.BadRequestError("Please provide the token id");
    } else if (!chain) {
      throw new CustomError.BadRequestError("Please provide the auction chain");
    } else {
      let createObj = {
        nftId,
        auctionId,
        startBid,
        auctionType,
        auctionStartOn: new Date(),
        auctionStartTxnHash: auctionHash,
        tokenId,
        chain,
        auctionStatus: 2,
        name,
        sellerWallet,
        sellerId,
        cloudinaryUrl
      };

      const auction = await Auction.create(createObj)
      const nft = await Nft.updateOne(
        {
          _id: nftId
        },
        {
          owner: "61e031128ef7d9d1b48a4a7e",
          nftStatus: 2
        }
      );
      res.status(StatusCodes.OK).json({ auction, nft });
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const buy = async (req, res) => {
  try {
      const { auctionId, nftId, owner, endAuctionHash } = req.body
      const auction = await Auction.updateOne(
        { auctionId, nftId },
        {
          auctionStatus: 3,
          auctionEndedOn: new Date(),
          auctionEndTxnHash: endAuctionHash
        }
      );
      const nft = await Nft.updateOne(
        {
          _id: nftId
        },
        {
          owner,
          nftStatus: 1
        }
      );
      res.status(StatusCodes.OK).json({ auction, nft });
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const getAllSale = async (req, res) => {
  const auctions = await Auction.find({ auctionType: "Sale", auctionStatus: 2 });
  res.status(StatusCodes.OK).json({ data: auctions });
};

const getAllAuction = async (req, res) => {
  const auctions = await Auction.find({ auctionType: "Auction", auctionStatus: 2 });
  res.status(StatusCodes.OK).json({ data: auctions });
};

const getAuctionById = async (req, res) => {
  const auctionId = req.params.auctionId
  const auction = await Auction.find({ auctionId });
  res.status(StatusCodes.OK).json(auction);
};

const getAuctionByTokenId = async (req, res) => {
  const tokenId = req.params.tokenId
  const auction = await Auction.find({ tokenId });
  res.status(StatusCodes.OK).json(auction);
};

const startAuction = async (req, res) => {
  try {
    const { auctionId, nftId, auctionHash } = req.body;
    const auctionData = await Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
    });
    console.log(auctionData)
    const auction = await Auction.updateOne(
      { auctionId, nftId: ObjectId(nftId) },
      {
        auctionStatus: 2,
        auctionStartOn: new Date(),
        auctionStartTxnHash: auctionHash,
      }
    );
    res.status(StatusCodes.OK).json(auction);
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const placeBid = async (req, res) => {
  try {
    const {
      auctionId,
      nftId,
      bidValue,
      bidCurrency,
      bidHash,
      username,
      email,
      bidSuccess,
      bidObject,
    } = req.body;

    const auctionData = await Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
    });

    let bidNumber = 1;
    if (auctionData?.bidsPlaced) {
      // const lastBid = await getAuctionBids(auctionId, nftId, 1);
      const lastBidId = auctionData.lastBidId
      if (lastBidId) {
        const data = await Bids.findOne({
          _id: ObjectId(lastBidId)
        });
        console.log("data----------->", data);
        await sendBidRefundEmail({
          email: data.email,
          username: data.username,
          bidValue: data.bidValue,
          bidValue,
          nftId,
        });
      }
      bidNumber = auctionData.bidsPlaced + 1;
    }

    await sendBidEmail({ email, username, bidValue });

    if (auctionId != 0 && !auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the nft id");
    } else if (!bidValue) {
      throw new CustomError.BadRequestError("Please provide the bid value");
    } else if (!bidCurrency) {
      throw new CustomError.BadRequestError("Please provide the bid currency");
    } else if (!bidHash) {
      throw new CustomError.BadRequestError("Please provide the bid hash");
    } else if (!username) {
      throw new CustomError.BadRequestError("Please provide the username");
    } else if (!email) {
      throw new CustomError.BadRequestError("Please provide the email");
    } else if (!bidSuccess) {
      throw new CustomError.BadRequestError(
        "Please provide wheather bid is success or not"
      );
    } else if (bidObject) {
      throw new CustomError.BadRequestError(
        "Please provide the bid transaction Object"
      );
    } else {
      const auction = await Auction.findOne({ auctionId, nftId, status: 3 });

      if (auction.auctionStatus === 1)
        throw new CustomError.BadRequestError("Auction not started yet");
      if (auction.auctionStatus === 3)
        throw new CustomError.BadRequestError("Auction already ended");
      if (auction.auctionStatus === 4)
        throw new CustomError.BadRequestError("Auction already cancelled");

      const bidder = req.user.userId;
      let createObj = {
        auctionId: ObjectId(auctionId),
        nftId: ObjectId(nftId),
        bidValue,
        bidder,
        username,
        email,
        bidCurrency,
        bidHash,
        bidSuccess,
        bidObj: bidObject,
      };

      var bid = await Bids.create(createObj);

      await Auction.updateOne(
        { auctionId, nftId },
        { bidsPlaced: bidNumber, lastBidId: bid._id, lastBid: bidValue, highestBidder: bidder }
      );

      res.status(StatusCodes.OK).json(bid);
    }
  } catch (e) {
    throw new Error(`${e} Last Error`);
  }
};

const getAuctionBids = async (auctionId, nftId, bidsLimit) => {
  let query = `{ 
      $match : { 
          auctionId : ${auctionId}, 
          nftId: ${ObjectId(nftId)} 
        } 
    },`;
  if (bidsLimit) {
    query += `{ $sort : { createdAt : -1 } },{ $limit:  ${bidsLimit} }`;
  } else {
    query += `{ $sort : { bidValue : -1 } }`;
  }
  const auctionBids = Bids.aggregate([query]);
  console.log("auctionBids-------->", auctionBids);
  if (auctionBids.length) {
    return auctionBids;
  } else {
    return false;
  }
};

const endAuction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nftId, auctionId, endAuctionHash } = req.body;
    if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the nft id");
    } else if (!auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!endAuctionHash) {
      throw new CustomError.BadRequestError(
        "Please provide the transaction hash"
      );
    } else {
      const auction = await Auction.findOne({ auctionId, nftId });
      if (auction.auctionStatus === 3)
        throw new CustomError.BadRequestError("Auction already ended");
      if (auction.auctionStatus === 4)
        throw new CustomError.BadRequestError("Auction already cancelled");

      // const auctionBids = await getAuctionBids(auctionId, nftId, 0);
      const lastBidId = auction.lastBidId
      const nft = await Nft.findOne({ _id: nftId });
      if (auction.bidsPlaced) {
        const bid = await Bids.findOne({
          _id: ObjectId(lastBidId)
        });  

        await sendAuctionSoldEmail({
          email: bid.email,
          username: bid.username,
          imageHash: nft.imageHash,
          name: nft.name,
          lastBid: bid.bidValue,
        });

        const auctionWinner = bid.bidder
        await Auction.updateOne(
          { auctionId, nftId },
          {
            auctionStatus: 3,
            auctionEndedOn: new Date(),
            auctionEndTxnHash: endAuctionHash,
            auctionWinner: auctionWinner,
          }
        );

        await NFTStates.create({
          nftId: ObjectId(nftId),
          state: "Transfer",
          from: "address",
          to: "contract",
        });

        await Nft.updateOne(
          {
            nftId
          },
          {
            owner: auctionWinner,
            nftStatus: 1,
          }
        );
      } else {
        await Auction.updateOne(
          { auctionId, nftId },
          {
            auctionStatus: 3,
            auctionEndedOn: new Date(),
            auctionEndTxnHash: endAuctionHash
          }
        );

        await NFTStates.create({
          nftId,
          state: "Transfer",
          from: "address",
          to: "contract",
        });

        await Nft.updateOne(
          {
            nftId
          },
          {
            owner: userId,
            nftStatus: 1,
          }
        );
      }

      res.status(StatusCodes.OK).json("Auction Ended");
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const cancelAuction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { auctionId, nftId, transactionHash } = req.body;
    const auctionDetails = await Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
    });
    console.log(auctionDetails._id);
    if (auctionDetails.auctionStatus === 4)
      throw new CustomError.BadRequestError("Auction already cancelled");
    if (auctionDetails.auctionStatus === 3)
      throw new CustomError.BadRequestError(
        "Can't cancel the finished auction"
      );
    if (auctionDetails.auctionStatus === 1)
      throw new CustomError.BadRequestError("Auction not started yet");

    await Auction.updateOne(
      {
        auctionId,
        nftId
      },
      {
        auctionCancelledOn: new Date(),
        auctionCancelTxnHash: transactionHash,
        auctionStatus: 4,
      }
    );

    const nft = await Nft.updateOne(
      {
        _id: nftId
      },
      {
        owner: userId,
        nftStatus: 1,
      }
    );
    res.status(StatusCodes.OK).json("Auction Cancelled");
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const addViews = async (req, res) => {
  try {
    const { auctionId, nftId } = req.body;
    if (!auctionId)
      throw new CustomError.BadRequestError("Please provide the auction id");
    if (!nftId)
      throw new CustomError.BadRequestError("please provide the nft id");

    const d = await Auction.fineOne({ auctionId, nftId: ObjectId(nftId) });
    const views = d.views + 1;
    await Auction.updateOne({ auctionId, nftId: ObjectId(nftId) }, { views });
    res.status(StatusCodes.OK).json("Updated");
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

module.exports = {
  sell,
  buy,
  getAllSale,
  getAllAuction,
  create,
  startAuction,
  placeBid,
  endAuction,
  getAuctionById,
  cancelAuction,
  getAuctionByTokenId,
  addViews,
};
