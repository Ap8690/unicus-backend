const { StatusCodes } = require("http-status-codes");
const { NotificationSettings } = require("../../../models");
const CustomError = require("./../../../errors");

const getNotificationSetting = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await NotificationSettings.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateNotificationSetting = async (req, res) => {
  try {
    const {
      itemSold,
      bidActivity,
      priceChange,
      auctionExpiration,
      outbid,
      referralSuccessful,
      ownedAssetUpdates,
      successfulPurchase,
      newsletter,
      minEth,
      minMatic,
      minBnb
    } = req.body;
    const userId = req.user.userId;

    const obj = {
      itemSold,
      bidActivity,
      priceChange,
      auctionExpiration,
      outbid,
      referralSuccessful,
      ownedAssetUpdates,
      successfulPurchase,
      newsletter,
      minEth,
      minMatic,
      minBnb,
      user: userId,
    };
    const result = await NotificationSettings.findOneAndUpdate(
      { user: userId },
      obj,
      {
        upsert: true,
      }
    );
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

module.exports = {
  getNotificationSetting,
  updateNotificationSetting,
};
