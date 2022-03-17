const { StatusCodes } = require("http-status-codes");
const { Appearance } = require("../../../models");
const CustomError = require("./../../../errors");

const getAppearance = async (req, res) => {
  try {
    const storefront = req.storefront.id
    const result = await Appearance.findOne({ storefront });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
};

const getStoreLoader = async (req, res) => {
  try{
    const storefront = req.storefront.id;
    const result = await Appearance.findOne({ storefront});
    const storeLoader = result.storeLoader
    res.status(StatusCodes.OK).json({storeLoader})
  }
  catch(err){
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
      headerButton,
      featuredAssets,
      showFooter,
      showGettingStarted,
      storeLoader
    } = req.body;
    const userId = req.user.userId;
    const storefront = req.storefront.id;

    const obj = {
       colorPalette,
      enableDarkMode,
      heading,
      headerDescription,
      headerButton,
      featuredAssets,
      showFooter,
      showGettingStarted,
      storeLoader,
      user: userId,
    };
    const result = await Appearance.findOneAndUpdate({ user: userId, storefront }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
};


module.exports={
  getAppearance,
  getStoreLoader,
  updateAppearance
}