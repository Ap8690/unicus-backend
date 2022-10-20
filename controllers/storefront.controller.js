const { StatusCodes } = require("http-status-codes");

const {
    Storefront,
    General,
    Advance,
    Appearance,
    User,
    Analytics,
    Seo,
} = require("../models");
const CustomError = require("../errors");
const { convertToLowercase, isReservedWord } = require("../utils/stringUtil");
const validator = require("validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createStore = async (req, res) => {
    try {
        const { storeName, email, chainName } = req.body;
        console.log("req.body.country: ", req.body.country);
        const country = (JSON.parse(req.body.country)).country;
        console.log("country: ", country);
        const owner = req.user.userId;
        const subdomain = convertToLowercase(storeName);

        let imageUrl = req.files.logoUrl[0].location;
        console.log("imageUrl: ", imageUrl);

        const userInfo = await User.findOne({ _id: ObjectId(req.user.userId) });
        const emailTaken = await General.findOne({ email });
        const regex = new RegExp(/^[a-z][a-z0-9-\s]*$/i);
        let domain = "";
        let node_env = process.env.NODE_ENV.trim();
        if (node_env === "prod") {
            domain = `${subdomain}.unicus.one`;
        } else if (node_env === "staging") {
            domain = `${subdomain}.demo.unicus.one`;
        } else if (node_env === "demo") {
            domain = `${subdomain}.demo.unicus.one`;
        } else {
            domain = `${subdomain}.demo.unicus.one`;
        }
        const alreadyCreated = await Storefront.findOne({ domain });
        if (!domain || domain === "") {
            throw new CustomError.BadRequestError("Domain name missing");
        }
        if (!storeName || !regex.test(storeName)) {
            throw new CustomError.BadRequestError(
                "Please enter store name. Only letters, numbers and - is allowed."
            );
        }
        if (!validator.isEmail(email)) {
            throw new CustomError.BadRequestError("Please enter valid email.");
        }
        if (alreadyCreated || isReservedWord(subdomain)) {
            throw new CustomError.BadRequestError("Name not available.");
        }
        if (emailTaken) {
            throw new CustomError.BadRequestError("Email already in use.");
        }
        if (owner && userInfo && owner == userInfo._id) {
            const user = await User.findOne({ _id: owner });
            if (!user) {
                userInfo.doNotHash = true;
                const createUser = await User.create(userInfo);
                await User.updateOne({ id: owner }, { doNotHash: false });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ err: "Unauthorized" });
        }
        const obj = {
            domain: [domain],
            owner,
        };
        console.log("obj: ", obj);
        const createStore = await Storefront.create(obj);
        console.log("createStore: ", createStore);
        if (createStore) {
            const obj = {
                storeName,
                email,
                logoUrl:imageUrl,
                country,
                contactEmail: email,
                user: owner,
                storefront: createStore?.id,
                chainName,
            };
            try {
                let advObj = { user: owner, storefront: createStore?.id };
                console.log("advObj: ", advObj);
                if (chainName) {
                    console.log("chainName: ", chainName);
                    if (chainName.toLowerCase() === "ethereum") {
                        advObj = { ...advObj, showEth: { enabled: true } };
                    } else if (chainName.toLowerCase() === "polygon") {
                        advObj = { ...advObj, showPoly: { enabled: true } };
                    } else if (chainName.toLowerCase() === "polygon") {
                        advObj = { ...advObj, showPoly: { enabled: true } };
                    } else if (chainName.toLowerCase() === "binance") {
                        advObj = { ...advObj, showBinance: { enabled: true } };
                    } else if (chainName.toLowerCase() === "avalanche") {
                        advObj = { ...advObj, showAva: { enabled: true } };
                    } else if (chainName.toLowerCase() === "avalanche") {
                        advObj = { ...advObj, showAva: { enabled: true } };
                    } else if (chainName.toLowerCase() === "solana") {
                        advObj = { ...advObj, showSolana: { enabled: true } };
                    } else if (chainName.toLowerCase() === "near") {
                        advObj = { ...advObj, showNear: { enabled: true } };
                    } else if (chainName.toLowerCase() === "tron") {
                        advObj = { ...advObj, showTron: { enabled: true } };
                    }

                    console.log("asdfdsf", advObj);
                }
                console.log(126);
                await General.create(obj);
                console.log(127);
                await Advance.create(advObj);
                console.log(128);
                await Appearance.create({
                    user: owner,
                    storefront: createStore?.id,
                });
                console.log(16);
                res.status(StatusCodes.OK).json({ createStore });
            } catch (err) {
                console.log("err", err);
                await Storefront.deleteOne({ domain });
                await General.findOneAndDelete({ storefront: createStore?.id });
                await Advance.findOneAndDelete({ storefront: createStore?.id });
                await Appearance.findOneAndDelete({
                    storefront: createStore?.id,
                });
                res.json({ err });
            }
        }
    } catch (err) {
        console.log("err-store", err);
        res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
    }
};

const getStoreByUser = async (req, res) => {
    try {
        const owner = req.user.userId;
        const store = await Storefront.findOne({ owner });
        if (store) {
            res.status(StatusCodes.OK).json({ store });
        } else {
            res.status(StatusCodes.OK).json({});
        }
    } catch (err) {
        console.log("err", err.message);
        res.status(err.statusCode).json({ err: err.message });
    }
};

const getStoreDetails = async (req, res) => {
    try {
        const storefront = req.storefront?.id;
        if (!storefront) {
            return res.status(404).json({ err: "Storefront not found!" });
        }
        const general = await General.findOne({ storefront });
        const advance = await Advance.findOne({ storefront });
        const appearance = await Appearance.findOne({ storefront });
        const analytics = await Analytics.findOne({ storefront });
        const seo = await Seo.findOne({ storefront });

        const store = { general, advance, appearance, analytics, seo };
        res.status(StatusCodes.OK).json({ store });
    } catch (err) {
        console.log("err", err);
        res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
    }
};

module.exports = {
    createStore,
    getStoreByUser,
    getStoreDetails,
};
