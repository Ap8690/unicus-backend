const Nft = require("../models/Nft");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const { Bids, Auction } = require("../models");
const ObjectId = mongoose.Types.ObjectId;
// import { v4 as uuidv4 } from 'uuid';
const Views = require("../models/Views");
const Collection = require("../models/Collection");

const create = async (req, res) => {
    let {
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
        contractType,
        contractAddress,
        owner,
        uploadedBy,
        userInfo,
        tags,
        mintedInfo,
        quantity,
        externalLink,
    } = req.body;
    let cloudinaryUrl = req.files.image[0].location;
    if (tags.length > 0) {
        tags = JSON.parse(tags);
    }

    if (tags.length === 1) {
        if (tags[0].property.trim() == "" && tags[0].value.trim() == "") {
            tags = [];
        }
    }
    category = category.toLowerCase();
    const userId = req.user.userId;
    const storefront = req.storefront.id;

    const nft = await Nft.findOne({
        contractAddress,
        tokenId,
        chain,
        storefront,
    });
    if (nft) {
        throw new CustomError.BadRequestError("NFT already listed");
    }
    var nftCollection;
    if (collectionName) {
        var regex = new RegExp(`^${collectionName.trim()}$`, "ig");
        nftCollection = await Collection.findOne({
            collectionName: { $regex: regex },
            storefront,
        });
    }
    if (nftCollection) {
        console.log("1: ", nftCollection);
        if (userId == nftCollection.owner) {
            console.log("nftCollection: ", nftCollection);
            if (!jsonIpfs) {
                throw new CustomError.BadRequestError(
                    "Please provide the json IPFS"
                );
            } else if (!name) {
                throw new CustomError.BadRequestError(
                    "Please provide the nft name"
                );
            } else if (!nftType) {
                throw new CustomError.BadRequestError(
                    "Please provide the nft type"
                );
            }

            let createObj = quantity
                ? {
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
                      collectionName: nftCollection.collectionName,
                      collectionId: nftCollection._id,
                      category,
                      tags,
                      cloudinaryUrl,
                      royalty,
                      owner,
                      contractType,
                      contractAddress,
                      storefront,
                      quantity,
                      externalLink,
                  }
                : {
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
                      collectionName: nftCollection.collectionName,
                      collectionId: nftCollection._id,
                      category,
                      tags,
                      cloudinaryUrl,
                      royalty,
                      owner,
                      contractType,
                      contractAddress,
                      storefront,
                      externalLink,
                  };

            const data = await Nft.create(createObj);
            await Collection.updateOne(
                { collectionName: { $regex: regex }, storefront },
                { total: nftCollection.total + 1 }
            );
            await NFTStates.create({
                nftId: ObjectId(data._id),
                name,
                state: "Minted",
                from: "Null Address",
                to: userInfo,
                date: new Date(),
            });
            res.status(StatusCodes.CREATED).json({ data });
        } else {
            throw new CustomError.BadRequestError(
                "Collection name already exists with another user!"
            );
        }
    } else {
        if (!jsonIpfs) {
            throw new CustomError.BadRequestError(
                "Please provide the json IPFS"
            );
        } else if (!name) {
            throw new CustomError.BadRequestError(
                "Please provide the nft name"
            );
        } else if (!nftType) {
            throw new CustomError.BadRequestError(
                "Please provide the nft type"
            );
        }

        const createObj = quantity
            ? {
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
                  contractType,
                  contractAddress,
                  storefront,
                  quantity,
              }
            : {
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
                  contractType,
                  contractAddress,
                  storefront,
              };

        let data = await Nft.create(createObj);
        // if (collectionName) {
        //     const collectionObj = {
        //         owner: mintedBy,
        //         collectionName,
        //         storefront,
        //     };
        //     const col = await Collection.create(collectionObj);
        //     data = await Nft.findByIdAndUpdate(data._id, {
        //         collectionId: col._id,
        //     });
        // }
        await NFTStates.create({
            nftId: ObjectId(data._id),
            name,
            state: "Minted",
            from: "Null Address",
            to: userInfo,
            date: new Date(),
        });
        res.status(StatusCodes.CREATED).json({ data });
    }
};

const getNFTByNftId = async (req, res) => {
    try {
        const tokenId = req.params.nftId;
        const chain = Math.max(0, req.params.chain);
        const contractAddress = req.params.contractAddress;
        const storefront = req.storefront.id;
        const nftDbId = req.params.nftDbId;

        // auction id
        const assetListed = req.query.asset_listed;

        const nft = await Nft.findOne({
            tokenId,
            chain,
            contractAddress,
            storefront,
            _id: nftDbId,
        }).populate("mintedBy");
        let mintedUser = await nft.mintedBy;

        const nftStates = await NFTStates.find({ nftId: nft._id });
        const bids = await Bids.find({ nftId: nft._id });

        let auction_search = {
            nftId: nft._id,
            storefront,
            $or: [{ auctionStatus: 1 }, { auctionStatus: 2 }]
        };
        if (assetListed !== 'null') {
            auction_search._id = ObjectId(assetListed);
        }
        const auction = await Auction.find(auction_search);
        let total_quantity_listed = 0;
        for(let i=0;i<auction.length;i++) {
            total_quantity_listed += Number(auction[i].quantity);
        }

        res.status(StatusCodes.OK).json({
            nft,
            nftStates,
            bids,
            user: {
                profileUrl: mintedUser.profileUrl,
                username: mintedUser.username,
                email: mintedUser.email,
                bio: mintedUser.bio,
                id: mintedUser._id,
            },
            total_quantity_listed,
            auction,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            e: "Something Bad happened",
        });
    }
};

const getAll = async (req, res) => {
    const storefront = req.storefront.id;

    const totalNfts = await Auction.find({ storefront });
    const skip = Math.max(0, req.params.skip);

    console.log(totalNfts.length);
    if (totalNfts.length < skip + 5) {
        const limit = Math.max(0, totalNfts.length - skip);
        console.log(skip);
        const nfts = await Auction.find({ storefront }).limit(limit).skip(skip);
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        });
    } else {
        const skip = Math.max(0, req.params.skip);
        console.log(skip);
        const nfts = await Auction.find({ storefront }).limit(5).skip(skip);
        res.status(StatusCodes.OK).json({
            data: nfts,
            totalNfts: totalNfts.length,
        });
    }
};

const getNftByCollections = async (req, res) => {
    try {
        const storefront = req.storefront.id;
        const collection = req.params.collection;

        const nft = await Nft.find({ collectionId: collection, storefront });
        res.status(StatusCodes.OK).json({
            nft,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.BAD_REQUEST);
    }
};

const getTrendingCollections = async (req, res) => {
    try {
        const storefront = req.storefront.id;

        const collections = await Collections.find({
            storefront,
        }).countDocuments();

        let trendingCollection = [];
        for (let i = 0; i < collections; i++) {
            const nfts = Nft.aggregate([
                {
                    $match: {
                        collectionName: { $eq: collections[i].collectionName },
                    },
                },
                { $group: { _id: null, views: { $sum: "$views" } } },
            ]);
            trendingCollection.push({
                collection: collections[i],
                views: nfts.views,
            });
        }
        trendingCollection.sort(function (a, b) {
            return a - b;
        });
        res.status(StatusCodes.OK).json({
            trendingCollection,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.BAD_REQUEST);
    }
};

const getNFTByUserId = async (req, res) => {
    const userId = req.user.userId;
    const storefront = req.storefront.id;

    const skip = Math.max(0, req.params.skip - 1);
    const limit = 10;

    //1 NFTS
    const nfts = await Nft.find({
        owner: userId,
        // nftStatus: 1,
        active: true,
        storefront,
    })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    const nftLength = await Nft.find({
        owner: userId,
        // nftStatus: 1,
        active: true,
        storefront,
    }).countDocuments();

    //2 Auctions
    const auctions = await Auction.find({
        sellerId: userId,
        auctionStatus: 2,
        active: true,
        storefront,
    })
        .populate("nftId")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    const auctionLength = await Auction.find({
        sellerId: userId,
        auctionStatus: 2,
        active: true,
        storefront,
    }).countDocuments();

    //3 Collections
    const collections = await Collection.find({
        owner: userId,
        storefront,
    })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    const collectionLength = await Collection.find({
        owner: userId,
        storefront,
    })
        .limit(limit)
        .skip(skip)
        .countDocuments();

    res.status(StatusCodes.OK).json({
        nfts,
        auctions,
        collections,
        metadata: {
            limit: limit,
            skip: skip,
            totalNfts: nftLength,
            totalAuctions: auctionLength,
            totalCollections: collectionLength,
        },
    });
};

const getNFTViews = async (req, res) => {
    const nftId = req.params.nftId;
    const views = await Views.find({ nftId });
    res.status(StatusCodes.OK).json({ views });
};

const getNFTByUserName = async (req, res) => {
    const { username } = req.body;
    const storefront = req.storefront.id;
    var user, nftsOwned, nftsMinted;
    var regex = new RegExp(`^${username.trim()}$`, "ig");
    var auctions;
    if (username.length < 15) {
        user = await User.findOne({
            username: { $regex: regex },
            active: true,
        });
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
        user = await User.findOne({ wallets: { $regex: regex }, active: true });
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
    res.status(StatusCodes.OK).json({ nftsOwned, nftsMinted, user, auctions });
};

const mintNFT = async (req, res) => {
    const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body;
    const storefront = req.storefront.id;

    if (!nftId) {
        throw new CustomError.BadRequestError(true, "Please provide NFT id");
    } else if (!mintHash) {
        throw new CustomError.BadRequestError(
            true,
            "Please provide the mint hash"
        );
    } else if (!receipt) {
        throw new CustomError.BadRequestError(true, "Receipt is required");
    } else if (!blockNumber) {
        throw new CustomError.BadRequestError(
            true,
            "Please provide Block Number"
        );
    } else if (tokenId != 0 && !tokenId) {
        throw new CustomError.BadRequestError(true, "Please provide token Id");
    } else {
        let updateObj = {
            mintHash,
            mintReceipt: receipt,
            blockNumber,
            tokenId,
            mintedBy: receipt.from,
        };

        await Nft.updateOne({ _id: ObjectId(nftId), storefront }, updateObj);
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: "Mint",
            from: receipt.from,
            to: "contract",
        });
        res.status(StatusCodes.OK).send("NFT minted successfully");
    }
};
const getRecentlyCreatedNFTS = async (req, res) => {
    const storefront = req.storefront.id;
    const chain = req.params.chain;
    let nfts = [];
    if (chain != 0) {
        nfts = await Nft.find({ chain, nftStatus: 1, storefront })
            .limit(20)
            .sort({ createdAt: -1 });
    } else {
        nfts = await Nft.find({ nftStatus: 1, storefront })
            .limit(20)
            .sort({ createdAt: -1 });
    }
    res.status(StatusCodes.OK).json({ nfts });
};
const approveNFT = async (req, res) => {
    const { nftId, approveHash } = req.body;
    const storefront = req.storefront.id;
    if (nftId) {
        throw new CustomError.BadRequestError("Please provide the NFT id");
    } else if (!approveHash) {
        throw new CustomError.BadRequestError(
            "Please provide the approve hash"
        );
    } else {
        await Nft.updateOne(
            { _id: ObjectId(nftId), storefront },
            { isApproved: true, approvedAt: new Date(), approveHash }
        );
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: "Approve",
            from: "address",
            to: "contract",
        });
        res.status(StatusCodes.OK).send("NFT updated");
    }
};

const banNFT = async (req, res) => {
    const userId = req.body.userId;
    const storefront = req.storefront.id;
    if (!userId) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
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
            console.log(data2);
            res.json({
                status: 200,
                msg: "Success",
                data: data2,
            });
        } else {
            res.json({
                status: 200,
                msg: "Success",
                data: data,
            });
        }
    } else {
        throw new CustomError.BadRequestError("User not found!");
    }
};

const unbanNFT = async (req, res) => {
    const userId = req.body.userId;
    const storefront = req.storefront.id;
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
                msg: "Success",
                data: data2,
            });
        } else {
            res.json({
                status: 200,
                msg: "Success",
                data: data,
            });
        }
    } else {
        throw new CustomError.BadRequestError("User not found!");
    }
};

//featured artworks
const getFeaturedNfts = async (req, res) => {
    try {
        const { chain } = req.params;
        let search = {
            nftStatus: 2,
        };
        if (Number(chain) !== 0) {
            search.chain = chain;
        }
        console.log(chain);
        const featuredNfts = await Nft.find(search)
            .limit(req.params.number)
            .skip(0)
            .sort({ views: -1 });

        res.status(200).json({
            nfts: featuredNfts,
        });
    } catch (err) {
        res.status(500).json({
            err: "INT_SERVER_ERROR",
        });
    }
};

//trending nfts
const getTrendingNfts = async (req, res) => {
    try {
        const { category, number, chain } = req.params;

        let search = {
            nftStatus: 2,
        };
        if (category !== "all") {
            search.category = category;
        }
        if (Number(chain) !== 0) {
            search.chain = chain;
        }
        let trendingNfts = await Nft.find(search)
            .limit(number)
            .skip(0)
            .sort({ views: -1 });
        res.status(200).json({
            nfts: trendingNfts,
        });
    } catch (err) {
        res.status(500).json({
            err: "INT_SERVER_ERROR",
        });
    }
};

const oldNFt = async (req, res) => {
    // const toal = await Auction.updateMany(
    //   { storefront: { $exists: false } },
    //   { storefront: "624a951c1db000b674636777" }
    // );
    // console.log("oldNft", toal.length);
};

const createCollection = async (req, res) => {
    try {
        const {
            collectionName,
            description,
            category,
            website,
            discord,
            twitter,
            telegram,
            chain,
            linkedInUrl,
            instagramUrl,
        } = req.body;
        const logoUrl = req.files.logo[0].location;
        const bannerUrl = req.files.banner[0].location;
        const userId = req.user.userId;
        const storefront = req.storefront.id;
        const regex = new RegExp(`^${collectionName.trim()}$`, "ig");
        const nftCollection = await Collection.exists({
            collectionName: { $regex: regex },
            storefront,
        });
        if (nftCollection) {
            return res.status(400).send("Collection name already exists");
        }
        const createObj = {
            collectionName: collectionName.trim(),
            owner: userId,
            logoUrl: logoUrl,
            bannerUrl: bannerUrl,
            description,
            category,
            websiteUrl: website,
            discordUrl: discord,
            twitterUrl: twitter,
            telegramUrl: telegram,
            linkedInUrl: linkedInUrl,
            instagramUrl: instagramUrl,
            storefront,
            chain,
        };
        console.log(createObj);
        const ct = await Collection.create(createObj);
        console.log("ct: ", ct);
        res.status(StatusCodes.CREATED).json({ ct });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send();
    }
};

module.exports = {
    oldNFt,
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
    getNftByCollections,
    getTrendingCollections,
    getFeaturedNfts,
    getTrendingNfts,
    createCollection,
};
