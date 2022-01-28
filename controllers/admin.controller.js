const { StatusCodes } = require("http-status-codes");
const { Bids, User, Nft, Auction, NFTStates } = require("../models");

const dashboard = async (req, res) => {
  const totalUsers = await User.find();
  const totalNFTS = await Nft.find({ auctionType: "Auction" });
  const totalAuction = await Auction.find({ auctionType: "Auction" });
  const totalSale = await Auction.find({ auctionType: "Sale" });
  const totalBids = await Bids.find()
  const totalAuctionsEnded = await NFTStates.find({ state: "Auction" })
  const totalSalesEnded = await NFTStates.find({ state: "Sale" })

  res.status(StatusCodes.OK).json({ totalUsers: totalUsers.length, totalNFTS: totalNFTS.length, totalAuction: totalAuction.length, totalSale: totalSale.length, totalBids: totalBids.length, totalAuctionsEnded: totalAuctionsEnded.length, totalSalesEnded: totalSalesEnded.length });
};

const totalUsers = async (req, res) => {
    const totalUsers = await User.find().sort([['createdAt', -1]]);

    res.status(StatusCodes.OK).json({ totalUsers });
};

const totalNfts = async (req, res) => {
    const totalNfts = await Nft.find().sort([['createdAt', -1]]);

    res.status(StatusCodes.OK).json({ totalNfts });
};

const totalBids = async (req, res) => {
    const totalBids = await Bids.find().sort([['createdAt', -1]]);

    res.status(StatusCodes.OK).json({ totalBids });
};

const totalNftStates = async (req, res) => {
    const totalNftStates = await NFTStates.find().sort([['createdAt', -1]]);

    res.status(StatusCodes.OK).json({ totalNftStates });
};

module.exports = {
  dashboard,
  totalUsers,
  totalNfts,
  totalBids,
  totalNftStates
};
