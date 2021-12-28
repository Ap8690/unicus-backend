const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { Auction, Nft } = require("../models");
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
      auctionTime,
      auctionHash,
      tokenId,
      chain,
    } = req.body;

    if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the NFT id");
    } else if (!auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!startBid) {
      throw new CustomError.BadRequestError("please provide the start bid");
    } else if (!auctionType) {
      throw new CustomError.BadRequestError("please provide the auction type");
    } else if (!auctionTime) {
      throw new CustomError.BadRequestError("please provide the auction time");
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
        auctionTime,
        auctionStartOn: new Date(),
        auctionStartTxnHash: auctionHash,
        tokenId,
        chain,
        auctionStatus: 1,
      };

      await Auction.create(createObj);
      res.status(StatusCodes.Ok).json("Auction created");
    }
  } catch (e) {
    throw new CustomError.BadRequestError("Please try again..!");
  }
};

const startAuction = async (req, res) => {
  try {
    const { auctionId, nftId, auctionHash } = req.body;
    await Auction.updateOne(
      { auctionId, nftId },
      {
        auctionStatus: 2,
        auctionStartOn: new Date(),
        auctionStartTxnHash: auctionHash,
      }
    );
    res.status(StatusCodes.OK).json("Auction Started");
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
      await Bids.create(createObj);

      const auctionData = await Auction.findOne({
        auctionId,
        nftId: ObjectId(nftId),
      });
      let bidNumber = 1;
      if (auctionData?.bidsPlaced) {
        const lastBid = await getAuctionBids(auctionId, nftId, 1);

        if (lastBid) {
          const data = lastBid[0];
          console.log("data----------->", data);
          await sendBidRefundEmail({
            email: data.email,
            username: data.username,
            bidValue: data.bidValue,
            bidValue,
            origin,
            nftId,
          });
        }
        bidNumber = auctionData.bidsPlaced + 1;
      }

      await Auction.updateOne(
        { auctionId, nftId: ObjectId(nftId) },
        { bidsPlaced: bidNumber }
      );
      await sendBidEmail({ email, username, bidValue });
    }
  } catch (e) {
    throw new Error(e);
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
      const auction = await Auction.findOne({ auctionId, nftId, status: 3 });
      if (auction.auctionStatus === 3)
        throw new CustomError.BadRequestError("Auction already ended");

      const auctionBids = await getAuctionBids(auctionId, nftId, 0);
      const nft = await Nft.findOne({ _id: nftId });
      let auctionWinner;
      if (auctionBids) {
        auctionBids.forEach((a, i) => {
          if (i === 0 && a?.email) {
            await sendAuctionSoldEmail({
              email: a.email,
              username: a.username,
              imageHash: nft.imageHash,
              name: nft.name,
              lastBid: a.bidValue,
            });
            auctionWinner = a.bidder;
          } else if (a?.email) {
            await sendEndAuctionEmail({
              email: a.email,
              username: a.username,
              imageHash: nft.imageHash,
              name: nft.name,
              lastBid: a.bidValue,
            });
          }
        });
      }

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
      res.status(StatusCodes.OK).json("Auction Ended");
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const cancelAuction = async (req, res) => {
  try {
    const { auctionId, nftId, transactionHash } = req.body;
    const auctionDetails = Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
    });
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
        nftId: ObjectId(nftId),
      },
      {
        auctionCancelledOn: new Date(),
        auctionCancelTxnHash: transactionHash,
        auctionStatus: 4,
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
  create,
  startAuction,
  placeBid,
  endAuction,
  cancelAuction,
  addViews,
};
