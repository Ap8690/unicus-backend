const { StatusCodes } = require("http-status-codes");
const { Analytics } = require("../../../models");
const CustomError = require("./../../../errors");

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await Analytics.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateAnalytics = async (req, res) => {
  try {
    const {
      mailChimp,
      madmimi,
      sendGrid,
      googleAnalyticsUni,
      googleAnalyticsGA4,
      googleTagManager,
      mixpanel,
      facebookPixel
    } = req.body;
    const userId = req.user.userId;

    const obj = {
      mailChimp,
      madmimi,
      sendGrid,
      googleAnalyticsUni,
      googleAnalyticsGA4,
      googleTagManager,
      mixpanel,
      facebookPixel,
      user: userId,
    };
    const result = await Advance.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

module.exports={
  getAnalytics,
  updateAnalytics
}