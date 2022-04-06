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
      sellerInfo,
      cloudinaryUrl,
    } = req.body;
    var auctionTimer = new Date();
    const userId = req.user.userId;
    const storefront = req.storefront.id
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
      auctionTimer.setSeconds(auctionTimer.getSeconds() + duration);
      console.log(auctionTimer.toString());
      // const dateString = `${auctionTimer.getUTCDate} ++ ${auctionTimer.getUTCMonth + 1} ++ ${auctionTimer.getUTCFullYear} ++ ${auctionTimer.getUTCHours} ++ ${auctionTimer.getUTCMinutes}`
      const nftOne = await Nft.findOne({ _id: nftId, storefront });
      console.log(nftOne);
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
        sellerInfo,
        cloudinaryUrl,
        storefront,
        views: nftOne.views,
      };
      const auction = await Auction.create(createObj);
      const nft = await Nft.updateOne(
        {
          _id: nftId,
          storefront,
        },
        {
          owner: "61e559cb515235e5d16373fe",
          nftStatus: 3,
        }
      );
      console.log(nft);
      res.status(StatusCodes.OK).json({ auction, nft });
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
      sellerInfo,
      cloudinaryUrl,
    } = req.body;
    const storefront = req.storefront.id;

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
      const nftOne = await Nft.findOne({ _id: nftId });
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
        sellerInfo,
        cloudinaryUrl,
        storefront,
        views: nftOne.views,
      };

      const auction = await Auction.create(createObj);
      const nft = await Nft.updateOne(
        {
          _id: nftId,
          storefront
        },
        {
          owner: "61e559cb515235e5d16373fe",
          nftStatus: 2,
        }
      );
      console.log(auction, nft);
      res.status(StatusCodes.OK).json({ auction, nft });
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const buy = async (req, res) => {
  try {
    const { auctionId, nftId, owner, endAuctionHash, userInfo, name } =
      req.body;
    const userId = req.user.userId;
    const storefront = req.storefront.id;
    await Auction.updateOne(
      { _id: auctionId, storefront },
      {
        auctionStatus: 3,
        auctionEndedOn: new Date(),
        auctionEndTxnHash: endAuctionHash,
      }
    );
    const nft = await Nft.updateOne(
      {
        _id: nftId,
        storefront,
      },
      {
        owner,
        userInfo,
        nftStatus: 1,
      }
    );
    console.log(nft, owner);
    const auction = await Auction.findOne({ _id: auctionId, storefront });
    await NFTStates.create({
      nftId: ObjectId(nftId),
      state: "Sale",
      name,
      from: auction.sellerInfo,
      to: userInfo,
      price: auction.startBid,
      date: new Date(),
    });
    res.status(StatusCodes.OK).json({ nft });
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const getAllSale = async (req, res) => {
  const storefront = req.storefront.id;
  const skip = Math.max(0, req.params.skip);
  const chain = req.params.chain;
  console.log(chain);
  const auctions = await Auction.find({
    auctionType: "Sale",
    auctionStatus: 2,
    chain: chain,
    storefront
  });
  if (auctions.length < skip + 30) {
    const limit = Math.max(0, auctions.length - skip);
    const data = await Auction.find({
      auctionType: "Sale",
      auctionStatus: 2,
      chain: chain,
      storefront,
    })
      .limit(limit)
      .skip(skip)
      .sort([["tokenId", -1]]);
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length, msg: "Done" });
  } else {
    const data = await Auction.find({
      auctionType: "Sale",
      auctionStatus: 2,
      chain: chain,
      storefront,
    })
      .limit(30)
      .skip(skip)
      .sort([["tokenId", -1]]);
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length });
  }
};

const getAllAuction = async (req, res) => {
  const storefront = req.storefront.id;
  const sort = req.params.sort;
  console.log(JSON.parse(sort));
  const skip = Math.max(0, req.params.skip);
  const chain = req.params.chain;
  const auctions = await Auction.find({
    auctionType: "Auction",
    auctionStatus: 2,
    chain: chain,
    active: true,
    storefront,
  });
  if (auctions.length < skip + 30) {
    const limit = Math.max(0, auctions.length - skip);
    const data = await Auction.find({
      auctionType: "Auction",
      auctionStatus: 2,
      chain: chain,
      active: true,
      storefront,
    })
      .limit(limit)
      .skip(skip)
      .sort(JSON.parse(sort));
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length, msg: "Done" });
  } else {
    const data = await Auction.find({
      auctionType: "Auction",
      auctionStatus: 2,
      chain: chain,
      active: true,
      storefront,
    })
      .limit(30)
      .skip(skip)
      .sort(JSON.parse(sort));
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length });
  }
};

const getAllExplore = async (req, res) => {
  const storefront = req.storefront.id;
  console.log("storefront", storefront);
  const sort = req.params.sort;
  console.log("---------->", sort);
  console.log("+++++++++++", JSON.parse(sort));
  const skip = Math.max(0, req.params.skip);
  const chain = req.params.chain;
  const auctions = await Auction.find({
    auctionStatus: 2,
    chain: chain,
    active: true,
    storefront,
  });
  const count = await Auction.countDocuments({
    auctionStatus: 2,
    chain: chain,
    active: true,
    storefront,
  });
  console.log("c", auctions.length, count);
  if (auctions.length < skip + 30) {
    const limit = Math.max(0, auctions.length - skip);
    const data = await Auction.find({
      auctionStatus: 2,
      chain: chain,
      active: true,
      storefront,
    })
      .limit(limit)
      .skip(skip)
      .sort(JSON.parse(sort));
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length, msg: "Done" });
  } else {
    const data = await Auction.find({
      auctionStatus: 2,
      chain: chain,
      active: true,
      storefront,
    })
      .limit(30)
      .skip(skip)
      .sort(JSON.parse(sort));
    res
      .status(StatusCodes.OK)
      .json({ data: data, totalAuctions: auctions.length });
  }
};

const getRecentPurchased = async (req, res) => {
  try {
    const chain = req.params.chain;
    const storefront = req.storefront.id;
    const data = await Auction.find({
      storefront,
      auctionStatus: 3,
      chain: chain,
    })
      .limit(20)
      .sort([["createdAt", -1]]);

    if (data) {
      res.status(StatusCodes.OK).json({ data });
    } else {
      throw new CustomError.BadRequestError("Data not found");
    }
  } catch (err) {
    res.json({ err: err.message });
  }
};
const getAuctionById = async (req, res) => {
  const storefront = req.storefront.id;
  const tokenId = req.params.tokenId;
  const chain = Math.max(0, req.params.chain);
  const auction = await Auction.find({
    tokenId,
    chain,
    auctionStatus: 2,
    storefront,
  });
  res.status(StatusCodes.OK).json(auction);
};

const getAuctionByNftId = async (req, res) => {
  const storefront = req.storefront.id;
  const NftId = req.params.NftId;
  const auction = await Auction.findOne({
    nftId: NftId,
    auctionStatus: 2,
    storefront,
  });
  res.status(StatusCodes.OK).json(auction);
};

const startAuction = async (req, res) => {
  try {
    const storefront = req.storefront.id;
    const { auctionId, nftId, auctionHash } = req.body;
    const auctionData = await Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
      storefront,
    });
    console.log(auctionData);
    const auction = await Auction.updateOne(
      { auctionId, nftId: ObjectId(nftId), auctionStatus: 1, storefront },
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
    const storefront = req.storefront.id;
    const auctionData = await Auction.findOne({
      _id: auctionId,
      auctionStatus: 2,
      storefront,
    });
    let bidNumber = 1;
    console.log(auctionData?.bidsPlaced);
    if (auctionData?.bidsPlaced) {
      // const lastBid = await getAuctionBids(auctionId, nftId, 1);
      const lastBidId = auctionData.lastBidId;
      if (lastBidId) {
        const data = await Bids.findOne({
          _id: ObjectId(lastBidId),
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
      const auction = await Auction.findOne({
        _id: auctionId,
        auctionStatus: 2,
        storefront,
      });
      console.log(auction);
      if (auction.auctionStatus === 1)
        throw new CustomError.BadRequestError("Auction not started yet");
      if (auction.auctionStatus === 3)
        throw new CustomError.BadRequestError("Auction already ended");
      if (auction.auctionStatus === 4)
        throw new CustomError.BadRequestError("Auction already cancelled");

      const bidder = req.user.userId;
      let createObj = {
        auctionId: auctionId,
        nftId: nftId,
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
      console.log(bid);
      await Auction.updateOne(
        { _id: auctionId, storefront },
        {
          bidsPlaced: bidNumber,
          lastBidId: bid._id,
          lastBid: bidValue,
          highestBidder: bidder,
        }
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
    const storefront = req.storefront.id
    console.log("--------->UserID");
    const { nftId, auctionId, endAuctionHash, userInfo, name } = req.body;
    console.log(nftId);
    if (!nftId) {
      throw new CustomError.BadRequestError("Please provide the nft id");
    } else if (!auctionId) {
      throw new CustomError.BadRequestError("Please provide the auction id");
    } else if (!endAuctionHash) {
      throw new CustomError.BadRequestError(
        "Please provide the transaction hash"
      );
    } else {
      const auction = await Auction.findOne({ _id: auctionId , storefront});
      if (auction.auctionStatus === 3)
        throw new CustomError.BadRequestError("Auction already ended");
      if (auction.auctionStatus === 4)
        throw new CustomError.BadRequestError("Auction already cancelled");

      // const auctionBids = await getAuctionBids(auctionId, nftId, 0);
      const lastBidId = auction.lastBidId;
      console.log(lastBidId, auction.bidsPlaced);
      const nft = await Nft.findOne({ _id: nftId, storefront });
      if (auction.bidsPlaced) {
        const bid = await Bids.findOne({
          _id: ObjectId(lastBidId),
        });

        await sendAuctionSoldEmail({
          email: bid.email,
          username: bid.username,
          imageHash: nft.imageHash,
          name: nft.name,
          lastBid: bid.bidValue,
        });

        const auctionWinner = bid.bidder;
        await Auction.updateOne(
          { _id: auctionId, storefront },
          {
            auctionStatus: 3,
            auctionEndedOn: new Date(),
            auctionEndTxnHash: endAuctionHash,
            auctionWinner: auctionWinner,
          }
        );

        await NFTStates.create({
          nftId: nftId,
          name,
          state: "Auction",
          from: userInfo,
          to: auctionWinner,
        });

        await Nft.updateOne(
          {
            _id: nftId,
            storefront,
          },
          {
            owner: auctionWinner,
            userInfo,
            nftStatus: 1,
          }
        );
      } else {
        console.log("--------->Update");

        await Auction.updateOne(
          { _id: auctionId, storefront },
          {
            auctionStatus: 3,
            auctionEndedOn: new Date(),
            auctionEndTxnHash: endAuctionHash,
          }
        );

        await Nft.updateOne(
          {
            _id: nftId,
            storefront,
          },
          {
            owner: userId,
            nftStatus: 1,
          }
        );
      }
      console.log(auction, nft);

      res.status(StatusCodes.OK).json("Auction Ended");
    }
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const cancelAuction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const storefront = req.storefront.id
    const { auctionId, nftId, transactionHash } = req.body;
    const auctionDetails = await Auction.findOne({
      _id: auctionId,
      storefront,
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

    const auction = await Auction.updateOne(
      {
        _id: auctionId,
        storefront,
      },
      {
        auctionCancelledOn: new Date(),
        auctionCancelTxnHash: transactionHash,
        auctionStatus: 4,
      }
    );

    const nft = await Nft.updateOne(
      {
        _id: nftId,
        storefront,
      },
      {
        owner: userId,
        nftStatus: 1,
      }
    );
    console.log(nft, auction);
    res.status(StatusCodes.OK).json("Auction Cancelled");
  } catch (e) {
    throw new CustomError.BadRequestError(e);
  }
};

const addViews = async (req, res) => {
  try {
    const storefront = req.storefront.id;
    const { auctionId, nftId } = req.body;
    if (!auctionId)
      throw new CustomError.BadRequestError("Please provide the auction id");
    if (!nftId)
      throw new CustomError.BadRequestError("please provide the nft id");

    const d = await Auction.findOne({
      auctionId,
      nftId: ObjectId(nftId),
      storefront,
    });
    const views = d.views + 1;
    await Auction.updateOne(
      { auctionId, nftId: ObjectId(nftId), storefront },
      { views }
    );
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
  getRecentPurchased,
  create,
  startAuction,
  placeBid,
  endAuction,
  getAuctionById,
  cancelAuction,
  getAllExplore,
  getAuctionByNftId,
  addViews,
};
