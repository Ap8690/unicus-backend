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

const getCollectionDetails = async function (req, res) {
    try {
        const getCollection = await Collection.findOne({
            _id: ObjectId(req.params.id),
        });

        if (Object.keys(getCollection).length === 0)
            return res.status(Status.NotFound).send("");
        res.status(200).send({
            collectionId: getCollection._id,
            description: getCollection.description,
            category: getCollection.category,
            websiteUrl: getCollection.websiteUrl,
            twitterUrl: getCollection.twitterUrl,
            discordUrl: getCollection.discordUrl,
            telegramUrl: getCollection.telegramUrl,
            storefront: getCollection.storefront,
            bannerUrl: getCollection.bannerUrl,
            logoUrl: getCollection.logoUrl,
            collectionName: getCollection.collectionName,
            owner: getCollection.owner,
            createdAt: getCollection.createdAt
        });
    } catch (err) {
        res.status();
    }
};
const getCollections = async (req, res) => {
    try {
        const { collectionId } = req.params;
        console.log("collectionId: ", collectionId);
        const storefront = req?.storefront.id;
        const sort = req.params.sort;
        const skip = Math.max(0, req.params.skip);
        const limit = req.params.limit;

        let nft_search = {
            active: true,
            storefront: ObjectId(storefront),
            collectionId: ObjectId(collectionId)
        }
        
        const nfts = await Nft
            .find(nft_search)
            .select({"_id":1})
            .limit(limit)
            .skip(skip)
            .sort({'updatedAt': -1})
        let nftIds = []
        for(let i=0;i<nfts.length;i++) {
            nftIds.push(nfts[i]._id)
        }
        let auction_search = {
            'nftId': {'$in': nftIds}
        }
        let auctions;
        auctions = await Auction.find(auction_search).countDocuments();

        if (auctions < skip + 30) {
            const limit = Math.max(0, auctions - skip);
            let data;
            data = await Auction.find(auction_search)
                .limit(limit)
                .skip(skip)
                .sort({'updatedAt': -1})
                .populate("nftId");
            res.status(StatusCodes.OK).json({
                data: data,
                total: auctions
            });
        } else {
            const data = await Auction.find(auction_search)
                .limit(30)
                .skip(skip)
                .sort({'updatedAt': -1})
                .populate("nftId");
            res.status(StatusCodes.OK).json({
                data: data,
                total: auctions,
            });
        }
    } catch (err) {
        console.log("err: ", err);
        res.status(StatusCodes.BAD_REQUEST).send();
    }
};

const getCollectionsByUser = async (req, res) => {
    try {
        const storefront = req.storefront.id;
        const owner = req.user.userid;
        const limit = req.params.limit;
        const skip = req.params.skip;

        const collections = await Collection.find({ owner, storefront })
            .skip(skip)
            .limit(limit);
        res.status(StatusCodes.OK).json({
            collections,
        });
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.BAD_REQUEST);
    }
};

const searchCollection = async (req, res) => {
    try {
        var regex = new RegExp(`${req.query.search.trim()}`, "ig");
        const searching = await Collection.find({
            collectionName: { $regex: regex },
            storefront: req.storefront.id,
            owner: ObjectId(req.user.userId),
        }).select({ collectionName: 1, _id: 1 });

        if (!searching) return res.status(StatusCodes.NOT_FOUND).send(404);
        let result = [];

        for (let i = 0; i < searching.length; i++) {
            result[i] = {
                id: searching[i]._id,
                name: searching[i].collectionName,
            };
        }

        res.status(StatusCodes.OK).send(result);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send();
    }
};

const getallCollections = async (req, res) => {
    try {
        const storefront = req.storefront.id;
        const skip = Math.max(0, req.params.skip);
        const limit = req.params.limit;
        const filter = req.query.filter;
        const queryCollection = {
            active: true,
            storefront,
        }
        if(filter.toLowerCase() !== 'all' && filter !== undefined) {
            queryCollection.category = filter.toLowerCase();
        }
        console.log("queryCollection: ", queryCollection);
        const collections = await Collection.find(queryCollection).countDocuments();
        let data;
        
        data = await Collection.find(queryCollection)
            .limit(limit)
            .skip(skip)
            .populate('owner', {'wallets':1})
            .sort({'createdAt':-1});
        res.status(StatusCodes.OK).json({
            data,
            total: collections,
        });
    } catch (err) {
        console.log("err: ", err);
        res.status(StatusCodes.ERROR).send();
    }
};

module.exports = {
    getCollectionDetails,
    searchCollection,
    getCollectionsByUser,
    getCollections,
    getallCollections
};
