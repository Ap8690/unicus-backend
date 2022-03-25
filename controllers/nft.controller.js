const Nft = require('../models/Nft')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const mongoose = require('mongoose')
const NFTStates = require('../models/NFT-States')
const { Bids, Auction } = require('../models')
const ObjectId = mongoose.Types.ObjectId
// import { v4 as uuidv4 } from 'uuid';
const Views = require("../models/Views");
const Collection = require('../models/Collection')

const create = async (req, res) => {
    const {
        jsonIpfs,
        name,
        nftType,
        description,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        royalty,
        cloudinaryUrl,
        owner,
        uploadedBy,
        userInfo,
        tags,
        mintedInfo,
    } = req.body
    const userId = req.user.userId
    const storefront = req.storefront.id

    var nftCollection
    if(collectionName) {
        var regex = new RegExp(`^${collectionName.trim()}$`, 'ig')
        nftCollection = await Collection.findOne({
            collectionName: { $regex: regex }, storefront
        })
    }
    console.log(nftCollection)
    if (nftCollection) {
        if (mintedInfo == nftCollection.mintedInfo) {

            console.log(req.body)
            if (!jsonIpfs) {
                throw new CustomError.BadRequestError('Please provide the json IPFS')
            } else if (!name) {
                throw new CustomError.BadRequestError('Please provide the nft name')
            } else if (!nftType) {
                throw new CustomError.BadRequestError('Please provide the nft type')
            }

            var contractAddress
            if (chain == "56") {
                contractAddress = "0x2f376c69feEC2a4cbb17a001EdB862573898E95a"
            } else if (chain == "1") {
                contractAddress = "0x424bb7731c056a52b45CBD613Ef08c69c628735f"
            } else if (chain == "137") {
                contractAddress = "0x1549EabD2a47762413ee1A11e667E67A5825ff44"
            }

            const createObj = {
                userInfo,
                jsonHash: jsonIpfs,
                name,
                description,
                nftType,
                uploadedBy,
                mintedInfo,
                chain,
                tokenId,
                mintedBy,
                collectionName,
                category,
                tags,
                cloudinaryUrl,
                royalty,
                owner,
                contractAddress,
                storefront
            }

            const data = await Nft.create(createObj)
            await Collection.updateOne({ collectionName: { $regex: regex }, storefront}, { total: nftCollection.total + 1 })
            console.log(data._id)
            await NFTStates.create({
                nftId: ObjectId(data._id),
                name,
                state: 'Minted',
                from: 'Null Address',
                to: userInfo,
                date: new Date(),
            })
            res.status(StatusCodes.CREATED).json({ data })
        } else {
            throw new CustomError.BadRequestError('Collection name already exists')
        }
    } else {
        console.log(req.body)
        if (!jsonIpfs) {
            throw new CustomError.BadRequestError('Please provide the json IPFS')
        } else if (!name) {
            throw new CustomError.BadRequestError('Please provide the nft name')
        } else if (!nftType) {
            throw new CustomError.BadRequestError('Please provide the nft type')
        }

        var contractAddress
        if (chain == "56") {
            contractAddress = "0x2f376c69feEC2a4cbb17a001EdB862573898E95a"
        } else if (chain == "1") {
            contractAddress = "0x424bb7731c056a52b45CBD613Ef08c69c628735f"
        } else if (chain == "137") {
            contractAddress = "0x1549EabD2a47762413ee1A11e667E67A5825ff44"
        }

        const createObj = {
            userInfo,
            jsonHash: jsonIpfs,
            name,
            description,
            nftType,
            uploadedBy,
            mintedInfo,
            chain,
            tokenId,
            mintedBy,
            collectionName,
            category,
            tags,
            cloudinaryUrl,
            royalty,
            owner,
            contractAddress,
            storefront
        }

        const data = await Nft.create(createObj)
        if(collectionName) {
            const collectionObj = {
                ownerName: mintedInfo,
                ownerId: mintedBy,
                collectionName,
                storefront
            }
            await Collection.create(collectionObj)
        }
        console.log(data._id)
        await NFTStates.create({
            nftId: ObjectId(data._id),
            name,
            state: 'Minted',
            from: 'Null Address',
            to: userInfo,
            date: new Date(),
        })
        res.status(StatusCodes.CREATED).json({ data })
    }
}

const getNFTByNftId = async (req, res) => {
    const tokenId = req.params.tokenId
    const chain = Math.max(0, req.params.chain)
    const storefront = req.storefront.id
    console.log(chain)
    const nft = await Nft.findOne({
        tokenId,
        chain,
        storefront
    })
    const userId = req.params.userId;
    var totalViews = await Views.find({ nftId: nft._id })
    if (totalViews.length == 0) {
        await Views.create({
            nftId: ObjectId(nft._id),
            views: [],
            heart: []
        })
        totalViews = await Views.find({ nftId: nft._id })
    }

    var user
    var filter = []
    if (userId !== "none") {
        user = await User.find({ _id: userId })
        filter = totalViews[0].views.filter((obj) => {
            return obj.userId.toString() == user[0]._id.toString()
        })
    }

    const nftStates = await NFTStates.find({ nftId: nft._id })
    const bids = await Bids.find({ nftId: nft._id })
    const mintedUser = await User.findOne({ _id: nft.mintedBy })
    const auction = await Auction.findOne({ nftId: nft._id, auctionStatus: 2, storefront })

    if (user && filter.length === 0) {
        const data = {
            profileUrl: user[0].profileUrl,
            username: user[0].username,
            bio: user[0].bio,
            userId: user[0]._id
        }
        await Views.updateOne(
            { nftId: nft._id },
            { $push: { views: data } },
            { new: true, upsert: true }
        )
        await Nft.updateOne({ _id: nft._id , storefront}, { views: nft.views + 1 })
        await Auction.updateOne(
            { nftId: nft._id, auctionStatus: 2, storefront },
            { views: nft.views + 1 }
        )
    }
    res.status(StatusCodes.OK).json({
        nft,
        nftStates,
        bids,
        mintedUser,
        auction,
    })
}

const getAll = async (req, res) => {
    const storefront = req.storefront.id;

    const totalNfts = await Auction.find({storefront})
    
    console.log(totalNfts.length)
    if (totalNfts.length < skip + 5) {
        const limit = Math.max(0, totalNfts.length - skip)
        console.log(skip)
        const nfts = await Auction.find({storefront}).limit(limit).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    } else {
        const skip = Math.max(0, req.params.skip)
        console.log(skip)
        const nfts = await Auction.find({storefront}).limit(5).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    }
}

const getallCollections = async (req, res) => {
    // const sort = req.params.sort
    // console.log("---------->", sort)
    // console.log("+++++++++++", JSON.parse(sort))
    const storefront = req.storefront.id
    const skip = Math.max(0, req.params.skip)
    const collections = await Collection.find({ active: true, storefront });
    if(collections.length < skip + 30) {
        const limit = Math.max(0, collections.length - skip)
        const data = await Collection.find({ active: true, storefront })
          .limit(limit)
          .skip(skip);
        res.status(StatusCodes.OK).json({ data: data, totalCollections: collections.length, msg: "Done" });
    } else {
        const data = await Collection.find({ active: true, storefront })
          .limit(30)
          .skip(skip);
        res.status(StatusCodes.OK).json({ data: data, totalCollections: collections.length });
    }
}

const getNFTByUserId = async (req, res) => {
    const userId = req.params.userId
    const storefront = req.storefront.id
    const nfts = await Nft.find({ owner: userId, nftStatus: 1, active: true , storefront})
    const auctions = await Auction.find({
      sellerId: userId,
      auctionStatus: 2,
      active: true,
      storefront,
    });
    res.status(StatusCodes.OK).json({ nfts, auctions })
}

const getNFTViews = async (req, res) => {
    const nftId = req.params.nftId
    const views = await Views.find({ nftId })
    res.status(StatusCodes.OK).json({ views })
}

const getNFTByUserName = async (req, res) => {
    const { username } = req.body
    const storefront = req.storefront.id;
    var user, nftsOwned, nftsMinted
    var regex = new RegExp(`^${username.trim()}$`, 'ig')
    var auctions
    if (username.length < 15) {
        user = await User.findOne({ username: { $regex: regex }, active: true })
        nftsOwned = await Nft.find({
          owner: user._id,
          active: true,
          storefront,
        });
        auctions = await Auction.find({
          sellerId: user._id,
          auctionStatus: 2,
          active: true,
          storefront,
        });
        nftsMinted = await Nft.find({
          mintedBy: ObjectId(user._id),
          active: true,
          storefront,
        });
    } else {
        user = await User.findOne({ wallets: { $regex: regex }, active: true })
        nftsOwned = await Nft.find({
          owner: user._id,
          active: true,
          storefront,
        });
        auctions = await Auction.find({
          sellerId: user._id,
          auctionStatus: 2,
          active: true,
          storefront,
        });
        nftsMinted = await Nft.find({
          mintedBy: ObjectId(user._id),
          active: true,
          storefront,
        });
    }
    res.status(StatusCodes.OK).json({ nftsOwned, nftsMinted, user, auctions })
}

const mintNFT = async (req, res) => {
    const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body
    const storefront = req.storefront.id;

    if (!nftId) {
        throw new CustomError.BadRequestError(true, 'Please provide NFT id')
    } else if (!mintHash) {
        throw new CustomError.BadRequestError(
            true,
            'Please provide the mint hash'
        )
    } else if (!receipt) {
        throw new CustomError.BadRequestError(true, 'Receipt is required')
    } else if (!blockNumber) {
        throw new CustomError.BadRequestError(
            true,
            'Please provide Block Number'
        )
    } else if (tokenId != 0 && !tokenId) {
        throw new CustomError.BadRequestError(true, 'Please provide token Id')
    } else {
        let updateObj = {
            mintHash,
            mintReceipt: receipt,
            blockNumber,
            tokenId,
            mintedBy: receipt.from,
        }

        await Nft.updateOne({ _id: ObjectId(nftId), storefront }, updateObj);
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: 'Mint',
            from: receipt.from,
            to: 'contract',
        })
        res.status(StatusCodes.OK).send('NFT minted successfully')
    }
}
const getRecentlyCreatedNFTS = async (req, res) => {
  const storefront = req.storefront.id;
  const chain = req.params.chain;
  const nfts = await Nft.find({ chain, nftStatus: 1, storefront })
    .limit(20)
    .sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ nfts });
};
const approveNFT = async (req, res) => {
    const { nftId, approveHash } = req.body
    const storefront = req.storefront.id;
    if (nftId) {
        throw new CustomError.BadRequestError('Please provide the NFT id')
    } else if (!approveHash) {
        throw new CustomError.BadRequestError('Please provide the approve hash')
    } else {
        await Nft.updateOne(
          { _id: ObjectId(nftId), storefront },
          { isApproved: true, approvedAt: new Date(), approveHash }
        );
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: 'Approve',
            from: 'address',
            to: 'contract',
        })
        res.status(StatusCodes.OK).send('NFT updated')
    }
}

const banNFT = async (req, res) => {
    const userId = req.body.userId
    const storefront = req.storefront.id
    if (!userId) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const user = await Nft.findOne({ _id: userId, storefront });
    const user2 = await Auction.findOne({
      nftId: userId,
      auctionStatus: 2,
      storefront,
    });
    if (user) {
        const data = await Nft.updateOne(
          { _id: userId, storefront },
          {
            $set: {
              active: false,
            },
          }
        );
        if (user2) {
            const data2 = await Auction.updateOne(
              { nftId: userId, storefront },
              {
                $set: {
                  active: false,
                },
              }
            );
            console.log(data2)
            res.json({
                status: 200,
                msg: 'Success',
                data: data2,
            })
        } else {
            res.json({
                status: 200,
                msg: 'Success',
                data: data,
            })
        }
    } else {
        throw new CustomError.BadRequestError('User not found!')
    }
}

const unbanNFT = async (req, res) => {
    const userId = req.body.userId
    const storefront = req.storefront.id;
    const user = await Nft.findOne({ _id: userId , storefront})
    const user2 = await Auction.findOne({
      nftId: userId,
      auctionStatus: 2,
      storefront,
    });
    if (user) {
        const data = await Nft.updateOne(
          { _id: userId, storefront },
          {
            $set: {
              active: true,
            },
          }
        );
        if (user2) {
            const data2 = await Auction.updateOne(
              { nftId: userId, storefront },
              {
                $set: {
                  active: true,
                },
              }
            );
            res.json({
                status: 200,
                msg: 'Success',
                data: data2,
            })
        } else {
            res.json({
                status: 200,
                msg: 'Success',
                data: data,
            })
        }
    } else {
        throw new CustomError.BadRequestError('User not found!')
    }
}

module.exports = {
    create,
    getNFTByNftId,
    getAll,
    mintNFT,
    approveNFT,
    getNFTByUserId,
    getNFTByUserName,
    getRecentlyCreatedNFTS,
    getNFTViews,
    unbanNFT,
    banNFT,
    getallCollections
}
