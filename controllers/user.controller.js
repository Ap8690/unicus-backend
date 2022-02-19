const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenPayload } = require('../utils')
const Web3 = require('web3')
var cloudinary = require('cloudinary')
const { Bids, NFTStates, Nft, Auction } = require('../models')
var web3 = new Web3()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

cloudinary.config({
    cloud_name: 'dhmglymaz',
    api_key: '519646171183911',
    api_secret: 'wztja-vWQOkLiqmHesfIfQSLZrE',
})

const getAllUsers = async (req, res) => {
    const skip = Math.max(0, req.params.skip)
    const users = await User.find({})
    if (users.length < skip + 30) {
        const limit = Math.max(0, users.length - skip)
        const data = await User.find({})
            .limit(limit)
            .skip(skip)
            .sort([['tokenId', -1]])
        res.status(StatusCodes.OK).json({ users: data, msg: 'Done' })
    } else {
        const data = await User.find({})
            .limit(30)
            .skip(skip)
            .sort([['tokenId', -1]])
        res.status(StatusCodes.OK).json({ users: data })
    }
}

const getSingleUser = async (req, res) => {
    const token = await Token.findOne({ token: req.params.token })
    const userId = req.user.userId
    console.log(userId)
    const user = await User.findOne({ _id: userId })
    if (!user) {
        throw new CustomError.NotFoundError(
            `No user with id : ${req.params.id}`
        )
    }
    res.status(StatusCodes.OK).json({ user })
}

const getGlobalSearch = async (req, res) => {
    const search = req.params.search
    console.log(search)
    var regex = new RegExp(`${search.trim()}`, 'ig')
    const users = await User.find({ username: { $regex: regex } })
    const nfts = await Auction.find({ name: { $regex: regex } })
    res.status(StatusCodes.OK).json({ users, nfts })
}

const getUserById = async (req, res) => {
    const userId = req.params.id
    console.log(userId)
    const user = await User.findOne({ _id: userId })
    if (!user) {
        throw new CustomError.NotFoundError(
            `No user with id : ${req.params.id}`
        )
    }
    res.status(StatusCodes.OK).json({ user })
}

const addWallet = async (req, res) => {
    const walletAddress = req.params.walletAddress

    var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
    const walletAlreadyExists = await User.findOne({
        wallets: { $regex: regex },
    })
    if (walletAlreadyExists) {
        throw new CustomError.BadRequestError(
            'User already exists with this wallet'
        )
    }

    const userId = req.user.userId
    console.log(walletAddress, userId)

    await User.updateOne(
        { _id: userId },
        { $push: { wallets: walletAddress } },
        { new: true, upsert: true }
    )

    const user = await User.findOne({ wallets: { $regex: regex } })

    console.log(user)

    res.status(StatusCodes.OK).json({ user })
}

const removeWallet = async (req, res) => {
    const walletAddress = req.params.walletAddress
    console.log(walletAddress)
    var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
    const userId = req.user.userId

    const userDetails = await User.findOne({
        _id: userId,
        wallets: { $regex: regex },
    })

    var user
    if (userDetails) {
        user = await User.updateOne(
            { _id: userId },
            { $pull: { wallets: { $regex: regex } } }
        )
    }

    var user = await User.findOne({ _id: userId })

    res.status(StatusCodes.OK).json(user)
}

const getUserNonceByAddress = async (req, res) => {
    const walletAddress = req.params.publicAddress
    const checkAddress = await web3.utils.isAddress(walletAddress)
    if (checkAddress) {
        const user = await User.findOne(
            { wallets: { $regex: new RegExp(walletAddress.trim(), 'i') } },
            { nonce: 1 }
        )
        if (user) {
            res.status(StatusCodes.OK).json({
                walletAddress: walletAddress,
                nonce: user.nonce,
            })
        } else {
            const randomString = crypto.randomBytes(10).toString('hex')
            const verifyNonce = await createHash(randomString)

            const wallets = [walletAddress]
            let createObj = {
                wallets,
                userType: 2,
                nonce: verifyNonce,
            }
            const newUser = await User.create(createObj)
            res.status(StatusCodes.CREATED).json({
                walletAddress: walletAddress,
                nonce: newUser.nonce,
            })
        }
    } else {
        throw new CustomError.BadRequestError('Invalid Wallet Address')
    }
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateProfilePicture = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne({ _id: userId })
    var profileToken
    if (user.profileUrl) {
        const length = user.profileUrl.split('/').length
        profileToken = user.profileUrl.split('/')[length - 1].split('.')[0]
        cloudinary.v2.uploader.destroy(
            `Unicus_User/${profileToken}`,
            function (error, result) {
                console.log(result, error)
            }
        )
    }
    await User.updateOne(
        { _id: userId },
        { profileUrl: req.body.cloudinaryUrl }
    )
    const finalUser = await User.findOne({ _id: userId })
    res.status(StatusCodes.OK).json({ user: finalUser })
}

const updateBackgroundPicture = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne({ _id: userId })
    var backgroundToken
    if (user.backgroundUrl) {
        const length = user.backgroundUrl.split('/').length
        backgroundToken = user.backgroundUrl
            .split('/')
            [length - 1].split('.')[0]
        cloudinary.v2.uploader.destroy(
            `Unicus_User/${backgroundToken}`,
            function (error, result) {
                console.log(result, error)
            }
        )
    }
    await User.updateOne(
        { _id: userId },
        { backgroundUrl: req.body.cloudinaryUrl }
    )
    const finalUser = await User.findOne({ _id: userId })
    res.status(StatusCodes.OK).json({ user: finalUser })
}

const updateUser = async (req, res) => {
    const { username, facebook, linkedIn, twitter, instagram, bio, discord } =
        req.body

    if (!username) {
        throw new CustomError.BadRequestError('Please provide the username')
    } else if (!bio) {
        throw new CustomError.BadRequestError('Please provide the bio')
    }

    const user = await User.findOne({ _id: req.user.userId })

    var regex = new RegExp(`^${username.trim()}$`, 'ig')
    const usernameAlreadyExists = await User.findOne({
        username: { $regex: regex },
    })
    if (
        usernameAlreadyExists &&
        username.toLowerCase().trim() !== user.username.toLowerCase().trim()
    ) {
        throw new CustomError.BadRequestError('Username already exists')
    }
    // if(username.toLowerCase().trim() !== user.username.toLowerCase().trim()) {
    const nfts = await Nft.updateMany(
        { owner: user._id },
        { userInfo: username.trim() }
    )
    await Nft.updateMany(
        { mintedInfo: user.username },
        { mintedInfo: username.trim() }
    )
    await Auction.updateMany(
        { sellerId: req.user.userId },
        { sellerInfo: username.trim() }
    )
    await Bids.updateMany(
        { bidder: req.user.userId },
        { username: username.trim() }
    )
    await NFTStates.updateMany(
        { from: user.username.trim() },
        { from: username.trim() }
    )
    await NFTStates.updateMany(
        { to: user.username.trim() },
        { to: username.trim() }
    )
    // }

    user.username = username
    user.facebook = facebook
    user.discord = discord
    user.linkedIn = linkedIn
    user.twitter = twitter
    user.instagram = instagram
    user.bio = bio

    await user.save()
    res.status(StatusCodes.OK).json({ msg: user, nfts })
}

const banUser = async (req, res) => {
    const userId = req.body.userId
    if (!userId) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const user = await User.findOne({ _id: userId })
    if (user) {
        const data = await User.updateOne(
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
            data: data,
        })
    } else {
        throw new CustomError.BadRequestError('User not found!')
    }
}

const unbanUser = async (req, res) => {
    const userId = req.body.userId
    const user = await User.findOne({ _id: userId })
    if (user) {
        const data = await User.updateOne(
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
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    getUserById,
    addWallet,
    removeWallet,
    getGlobalSearch,
    updateProfilePicture,
    updateBackgroundPicture,
    getUserNonceByAddress,
    unbanUser,
    banUser,
}
