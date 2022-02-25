const { StatusCodes } = require("http-status-codes");
const { Team } = require("../../../models");
const CustomError = require("../../../errors");

const getTeam = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await Team.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const {
      members
    } = req.body;
    const userId = req.user.userId;

    const obj = {
      members,
      user: userId,
    };
    const result = await Team.findOneAndUpdate({ user: userId }, obj, {
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
  getTeam,
  updateTeam
}
