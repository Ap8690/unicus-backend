const Nft = require("../models/Nft");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const { Bids, Auction } = require("../models");
const ObjectId = mongoose.Types.ObjectId;
const Views = require("../models/Views");
const Collection = require("../models/Collection");

const getCollectionById = async function (req, res) {
  try {
    const getCollection = await Collection.find({_id: ObjectId(req.params.id)})
    console.log("getCollection: ", getCollection);

    if(!getCollection) return res.status(Status.NotFound).send('')

    res.status(Status.OK).send(getCollection)
  }
  catch(err) {
    res.status()
  }
}


module.exports = {getCollectionById}