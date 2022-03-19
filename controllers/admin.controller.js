const { StatusCodes } = require('http-status-codes')
const { Bids, User, Nft, Auction, NFTStates } = require('../models')
const CustomError = require('../errors')
const crypto = require('crypto')
const {
    sendVerificationEmail,
    sendVerificationAdmin,
    createHash,
} = require('../utils')
const Admin = require('../models/Admin')

const register = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            throw new CustomError.BadRequestError('Please provide an email')
            // } else if (!password) {
            //     throw new CustomError.BadRequestError('Please provide the password')
        }

        var regex = new RegExp(`^${email.trim()}$`, 'ig')
        const emailAlreadyExists = await Admin.findOne({
            email: { $regex: regex },
        })
        if (emailAlreadyExists) {
            throw new CustomError.BadRequestError('Email already exists')
        }

        // var regex = new RegExp(`^${username.trim()}$`, 'ig')
        // const usernameAlreadyExists = await User.findOne({
        //     username: { $regex: regex },
        // })
        // if (usernameAlreadyExists) {
        //     throw new CustomError.BadRequestError('Display Name already exists')
        // }

        const verificationToken = crypto.randomBytes(40).toString('hex')
        const passwordToken = crypto.randomBytes(70).toString('hex')
        let createObj = {
            email,
            verificationToken,
        }

        console.log(createObj)
        const user = await Admin.create(createObj)
        const origin = 'http://localhost:3000/'

        await sendVerificationAdmin({
            email: user.email,
            verificationToken: user.verificationToken,
            token: passwordToken,
            origin,
        })

        const tenMinutes = 1000 * 60 * 10
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

        user.passwordToken = createHash(passwordToken)
        user.passwordTokenExpirationDate = passwordTokenExpirationDate
        await user.save()

        res.status(StatusCodes.CREATED).json({
            msg: 'Success! Please check your email to verify yourself as Admin',
        })
    } catch (e) {
        console.log(e.message)
        throw new CustomError.BadRequestError(e.message)
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const { email } = req.body
        console.log(req.body)
        console.log(email)
        if (!email) {
            throw new CustomError.BadRequestError('Please provide an email')
        }

        const user = await Admin.find({ email: email })
        if (user) {
            const deletedUser = await Admin.deleteMany({ email: email })
            res.status(StatusCodes.OK).json({
                msg: 'Deleted Admin!',
                data: deletedUser,
            })
        } else {
            res.json({ status: 400, msg: 'User not found' })
        }
    } catch (err) {
        throw new CustomError.BadRequestError(err.message)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const email = req.query.email
        const verificationToken = req.query.token
        const { password, token } = req.body

        const user = await Admin.findOne({ email })
        if (!user) {
            throw new CustomError.UnauthenticatedError('Invalid Email')
        }

        if (!password) {
            throw new CustomError.BadRequestError('Please provide the password')
        }

        if (user.verificationToken === '') {
            throw new CustomError.UnauthenticatedError('User already verified')
        }
        if (user.verificationToken !== verificationToken) {
            throw new CustomError.UnauthenticatedError(
                'Invalid verification token'
            )
        }
        console.log('CHECK 1')
        if (user) {
            const currentDate = new Date()
            if (
                user.passwordToken === createHash(token) &&
                user.passwordTokenExpirationDate > currentDate
            ) {
                console.log('CHECK 2')
                user.password = password
                user.passwordToken = null
                user.passwordTokenExpirationDate = null
                console.log('CHECK 3')
                user.isVerified = true
                user.verified = Date.now()
                user.verificationToken = ''
                await user.save()
                res.status(StatusCodes.OK).json({
                    msg: 'Admin Verified! Password has been successfully updated',
                })
                // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
                // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            }
            res.status(StatusCodes.OK).json({
                msg: 'Already Verified!',
            })
        }
        return
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }

    return res.redirect('https://marketplace.unicus.one/')
}

const dashboard = async (req, res) => {
    const totalUsers = await User.find()
    const totalNFTS = await Nft.find({ auctionType: 'Auction' })
    const totalAuction = await Auction.find({ auctionType: 'Auction' })
    const totalSale = await Auction.find({ auctionType: 'Sale' })
    const totalBids = await Bids.find()
    const totalAuctionsEnded = await NFTStates.find({ state: 'Auction' })
    const totalSalesEnded = await NFTStates.find({ state: 'Sale' })

    res.status(StatusCodes.OK).json({
        totalUsers: totalUsers.length,
        totalNFTS: totalNFTS.length,
        totalAuction: totalAuction.length,
        totalSale: totalSale.length,
        totalBids: totalBids.length,
        totalAuctionsEnded: totalAuctionsEnded.length,
        totalSalesEnded: totalSalesEnded.length,
    })
}

const totalUsers = async (req, res) => {
    const totalUsers = await User.find().sort([['createdAt', -1]])

    res.status(StatusCodes.OK).json({ totalUsers })
}

const totalNfts = async (req, res) => {
    const totalNfts = await Nft.find().sort([['createdAt', -1]])

    res.status(StatusCodes.OK).json({ totalNfts })
}

const totalBids = async (req, res) => {
    const totalBids = await Bids.find().sort([['createdAt', -1]])

    res.status(StatusCodes.OK).json({ totalBids })
}

const totalNftStates = async (req, res) => {
    const totalNftStates = await NFTStates.find().sort([['createdAt', -1]])

    res.status(StatusCodes.OK).json({ totalNftStates })
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new CustomError.BadRequestError('Please provide an email.')
        } else if (!password) {
            throw new CustomError.BadRequestError('Please enter the password')
        }

        var regex = new RegExp(`^${email.trim()}$`, 'ig')
        const user = await Admin.findOne({ email: { $regex: regex } })

        if (!user) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials')
        }

        const isPasswordCorrect = await user.comparePassword(password)

        if (!isPasswordCorrect) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials')
        }

        if (!user.isVerified) {
            throw new CustomError.UnauthenticatedError(
                'Please verify your email'
            )
        }

        res.status(StatusCodes.OK).json({ user: user })
    } catch (e) {
        throw new CustomError.BadRequestError(e.message)
    }
}

// const getAllSuperAdmin = async function (req, res) {
//     try {
//         const superAdmin = await User.find({ isSuperAdmin: true })

//         if (superAdmin && superAdmin.length) {
//             res.json({ status: 200, msg: 'Success', data: superAdmin })
//         } else {
//             res.json({ status: 200, msg: 'No SuperUser Found' })
//         }
//     } catch (error) {
//         res.json({ status: 400, msg: error.toString() })
//     }
// }

const getAllAdmin = async function (req, res) {
    try {
        const admin = await Admin.find()

        if (admin && admin.length) {
            res.json({ status: 200, msg: 'Success', data: admin })
        } else {
            res.json({ status: 200, msg: 'No Admin Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

// Status -> 11 [Add Admin]
// Status -> 12 [Delete Admin]
// Status -> 21 [Add Super Admin]
// Status -> 22 [Delete Super Admin]
const changeUserStatus = async function (req, res) {
    let userId
    if (req.body.email) {
        const userData = await User.findOne({ email: req.body.email })
        console.log(userData)
        if (userData) {
            userId = userData._id
        } else {
            res.json({ status: 400, msg: 'User not found' })
            return
        }
    } else if (req.body.walletAddr) {
        const userData = await User.findOne({
            metamaskKey: req.body.walletAddr,
        })
        if (userData) {
            userId = userData._id
        } else {
            res.json({ status: 400, msg: 'User not found' })
            return
        }
    }
    try {
        if (req.body.status == undefined || req.body.status == 0) {
            res.json({ status: 400, msg: 'status is required' })
            return
        }

        if (userId == undefined || userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        const userInfo = await User.find({ _id: userId })
        if (userInfo && userInfo.length) {
            if (req.body.status === 11 || req.body.status === 12) {
                try {
                    const makeAdmin = await User.updateOne(
                        {
                            _id: userId,
                        },
                        {
                            $set: {
                                isAdmin: req.body.status == 11 ? true : false,
                                // isSuperAdmin:
                                //     req.body.status == 12
                                //         ? false
                                //         : userInfo[0].isSuperAdmin,
                            },
                        }
                    )
                    res.json({
                        status: 200,
                        msg: 'Success',
                        data: makeAdmin,
                    })

                    return
                } catch (err) {
                    console.log(err)
                    res.json({ status: 400, msg: 'Something went wrong' })
                    return
                }
                // } else if (req.body.status === 21 || req.body.status === 22) {
                //     try {
                //         const makeSuperAdmin = await User.updateOne(
                //             {
                //                 _id: userId,
                //             },
                //             {
                //                 $set: {
                //                     isSuperAdmin:
                //                         req.body.status == 21 ? true : false,
                //                     isAdmin: req.body.status == 22 ? false : true,
                //                 },
                //             }
                //         )
                //         res.json({
                //             status: 200,
                //             msg: 'Success',
                //             data: makeSuperAdmin,
                //         })

                //         return
                //     } catch (err) {
                //         console.log(err)
                //         res.json({ status: 400, msg: 'Something went wrong' })
                //         return
                //     }
            }
        } else {
            res.json({ status: 400, msg: 'User not found' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: 400, msg: error.toString() })
    }
}

module.exports = {
    dashboard,
    totalUsers,
    totalNfts,
    totalBids,
    register,
    login,
    totalNftStates,
    changeUserStatus,
    getAllAdmin,
    verifyEmail,
    deleteAdmin,
}
