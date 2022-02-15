const { StatusCodes } = require('http-status-codes')
const { Bids, User, Nft, Auction, NFTStates } = require('../models')
const CustomError = require('../errors')

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
    const { email, password } = req.body
    const obj = [
        {
            email: 'Info@unicus.one',
            password: 'Info@unicus.one',
        },
    ]
    var admin
    for (i = 0; i < obj.length; i++) {
        if (
            email.toLowerCase().trim() == obj[i].email.toLowerCase().trim() &&
            password == obj[i].password
        ) {
            admin = obj[i]
            res.status(StatusCodes.OK).json('Admin Valid')
        } else {
            throw new CustomError.BadRequestError('Invalid Credentials')
        }
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
        const admin = await User.find({ isAdmin: true })

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
    login,
    totalNftStates,
    changeUserStatus,
    getAllAdmin,
}
