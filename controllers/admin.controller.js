const { StatusCodes } = require("http-status-codes");
const { Bids, User, Nft, Auction, NFTStates } = require("../models");
const CustomError = require("../errors");

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

const login = async (req, res) => {
    const { email, password } = req.body
    const obj = [
      {
        email: "Info@unicus.one",
        password: "Info@unicus.one"
      }
    ]
    var admin
    for(i=0; i<obj.length; i++) {
      if(email.toLowerCase().trim() == obj[i].email.toLowerCase().trim() && password == obj[i].password) {
        admin = obj[i]
        res.status(StatusCodes.OK).json("Admin Valid");
      } else {
        throw new CustomError.BadRequestError("Invalid Credentials");
      }
    }
};

module.exports = {
  dashboard,
  totalUsers,
  totalNfts,
  totalBids,
  login,
  totalNftStates
};
