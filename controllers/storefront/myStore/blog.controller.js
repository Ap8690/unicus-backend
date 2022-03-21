const { StatusCodes } = require("http-status-codes");
const { Posts, Categories } = require("../../../models");
const CustomError = require("./../../../errors");

const getPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await Posts.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await Categories.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updatePosts = async (req, res) => {
  try {
    const { posts } = req.body;
    const userId = req.user.userId;

    const obj = {
      posts,
      user: userId,
    };
    const result = await Posts.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};
const updateCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    const userId = req.user.userId;

    const obj = {
      categories,
      user: userId,
    };
    const result = await Categories.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

module.exports = {
  getPosts,
  getCategories,
  updatePosts,
  updateCategories
};
