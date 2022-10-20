const { StatusCodes } = require("http-status-codes");
const { Appearance } = require("../../../models");
const CustomError = require("./../../../errors");

const getAppearance = async (req, res) => {
    try {
        const storefront = req.storefront.id;
        const result = await Appearance.findOne({ storefront });
        res.status(StatusCodes.OK).json({ result });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
    }
};

const getStoreLoader = async (req, res) => {
    try {
        const storefront = req.storefront.id;
        const result = await Appearance.findOne({ storefront });
        const storeLoader = result.storeLoader;
        res.status(StatusCodes.OK).json({ storeLoader });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
    }
};

const updateAppearance = async (req, res) => {
    try {
        const {
            colorPalette,
            enableDarkMode,
            heading,
            headerDescription,
            headerBg,
            headerPic,
            headerButton,
            featuredAssets,
            showFooter,
            showGettingStarted,
            storeLoader,
        } = req.body;
        const userId = req.user.userId;
        const storefront = req.storefront.id;

        let updateObj = { user: userId };

        if (colorPalette) {
            updateObj = { ...updateObj, colorPalette };
        }
        if (enableDarkMode) {
            updateObj = { ...updateObj, enableDarkMode };
        }
        if (heading) {
            updateObj = { ...updateObj, heading };
        }
        if (headerDescription) {
            updateObj = { ...updateObj, headerDescription };
        }
        if (headerBg) {
            updateObj = { ...updateObj, headerBg };
        }
        if (headerPic) {
            updateObj = { ...updateObj, headerPic };
        }
        if (headerButton) {
            updateObj = { ...updateObj, headerButton };
        }
        if (featuredAssets) {
            updateObj = { ...updateObj, featuredAssets };
        }
        if (showFooter) {
            updateObj = { ...updateObj, showFooter };
        }
        if (showGettingStarted) {
            updateObj = { ...updateObj, showGettingStarted };
        }
        if (storeLoader) {
            updateObj = { ...updateObj, storeLoader };
        }

        const result = await Appearance.findOneAndUpdate(
            { user: userId, storefront },
            updateObj,
            {
                upsert: true,
            }
        );
        if (result) {
            res.status(StatusCodes.OK).json({ result });
        }
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
    }
};

module.exports = {
    getAppearance,
    getStoreLoader,
    updateAppearance,
};
