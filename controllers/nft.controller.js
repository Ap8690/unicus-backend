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

    if (!jsonIpfs) {
        throw new CustomError.BadRequestError('Please provide the json IPFS')
    } else if (!name) {
        throw new CustomError.BadRequestError('Please provide the nft name')
    } else if (!nftType) {
        throw new CustomError.BadRequestError('Please provide the nft type')
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
    }

    const data = await Nft.create(createObj)
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

const getNFTByNftId = async (req, res) => {
    const nftId = req.params.nftId
    const nft = await Nft.findOne({
        _id: nftId,
    })  
    const userId = req.params.userId;
    var totalViews = await Views.find({ nftId })
    if(totalViews.length == 0) {
      await Views.create({
        nftId: ObjectId(nftId),
        views: [],
        heart: []
      })
      totalViews = await Views.find({ nftId: nftId })
    }
  
    var user
    var filter = []
    if(userId !== "none") {
      user = await User.find({ _id: userId })
      filter = totalViews[0].views.filter((obj) => {
        return obj.username == user[0].username
      })
    }

    const nftStates = await NFTStates.find({ nftId: nft._id })
    const bids = await Bids.find({ nftId: nft._id })
    const mintedUser = await User.findOne({ _id: nft.mintedBy })
    const auction = await Auction.findOne({ nftId: nft._id, auctionStatus: 2 })

    if (user && filter.length === 0) {
        const data = {
            profileUrl: user[0].profileUrl,
            username: user[0].username,
            bio: user[0].bio,
        }
        await Views.updateOne(
            { nftId: nftId },
            { $push: { views: data } },
            { new: true, upsert: true }
        )
        await Nft.updateOne({ _id: nftId }, { views: nft.views + 1 })
        await Auction.updateOne(
            { nftId, auctionStatus: 2 },
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
    const totalNfts = await Auction.find()
    console.log(totalNfts.length)
    if (totalNfts.length < skip + 5) {
        const limit = Math.max(0, totalNfts.length - skip)
        console.log(skip)
        const nfts = await Auction.find().limit(limit).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    } else {
        const skip = Math.max(0, req.params.skip)
        console.log(skip)
        const nfts = await Auction.find().limit(5).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    }
}

const getAllNFTS = async (req, res) => {
    const totalNfts = await Nft.find()
    console.log(totalNfts.length)
    if (totalNfts.length < skip + 5) {
        const limit = Math.max(0, totalNfts.length - skip)
        console.log(skip)
        const nfts = await Nft.find().limit(limit).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    } else {
        const skip = Math.max(0, req.params.skip)
        console.log(skip)
        const nfts = await Nft.find().limit(5).skip(skip)
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        })
    }
}

const getNFTByUserId = async (req, res) => {
    const userId = req.params.userId
    const nfts = await Nft.find({ owner: userId, nftStatus: 1 })
    const auctions = await Auction.find({ sellerId: userId, auctionStatus: 2 })
    res.status(StatusCodes.OK).json({ nfts, auctions })
}

const getNFTViews = async (req, res) => {
    const nftId = req.params.nftId
    const views = await Views.find({ nftId })
    res.status(StatusCodes.OK).json({ views })
}

const getNFTByUserName = async (req, res) => {
    const { username } = req.body
    var user, nftsOwned, nftsMinted
    var regex = new RegExp(`^${username.trim()}$`, 'ig')
    var auctions
    if (username.length < 15) {
        user = await User.findOne({ username: { $regex: regex } })
        nftsOwned = await Nft.find({ owner: user._id })
        auctions = await Auction.find({ sellerId: user._id, auctionStatus: 2 })
        nftsMinted = await Nft.find({ mintedBy: ObjectId(user._id) })
    } else {
        user = await User.findOne({ wallets: { $regex: regex } })
        nftsOwned = await Nft.find({ owner: user._id })
        auctions = await Auction.find({ sellerId: user._id, auctionStatus: 2 })
        nftsMinted = await Nft.find({ mintedBy: ObjectId(user._id) })
    }
    res.status(StatusCodes.OK).json({ nftsOwned, nftsMinted, user, auctions })
}

const mintNFT = async (req, res) => {
    const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body

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

        await Nft.updateOne({ _id: ObjectId(nftId) }, updateObj)
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: 'Mint',
            from: receipt.from,
            to: 'contract',
        })
        res.status(StatusCodes.OK).send('NFT minted successfully')
    }
}

const approveNFT = async (req, res) => {
    const { nftId, approveHash } = req.body
    if (nftId) {
        throw new CustomError.BadRequestError('Please provide the NFT id')
    } else if (!approveHash) {
        throw new CustomError.BadRequestError('Please provide the approve hash')
    } else {
        await Nft.updateOne(
            { _id: ObjectId(nftId) },
            { isApproved: true, approvedAt: new Date(), approveHash }
        )
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
    if (!userId) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const user = await Nft.findOne({ _id: userId })
    const user2 = await Auction.findOne({ nftId: userId, auctionStatus: 2 })
    if (user) {
        const data = await Nft.updateOne(
            { _id: userId },
            {
                $set: {
                    active: false,
                },
            }
        )
        if(user2) {
            const data2 = await Nft.updateOne(
                { _id: userId },
                {
                    $set: {
                        active: false,
                    },
                }
            )
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
    const user = await Nft.findOne({ _id: userId })
    if (user) {
        const data = await Nft.updateOne(
            { _id: userId },
            {
                $set: {
                    active: true,
                },
            }
        )
        res.json({
            status: 200,
            msg: 'Success',
            data: data,
        })
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
    getNFTViews,
    unbanNFT,
    banNFT,
}
