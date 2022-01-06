const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"];
    const bearerToken = accessToken.split(" ")[1];
    if (accessToken) {
      const payload = isTokenValid(bearerToken);
      if (!payload) {
        return res.status(StatusCodes.OK).json({ msg: "Invalid Token" });
      }

      req.user = payload;
      console.log("authenticate")

      return next();
    } else {
      console.log("authenticate")

      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid Token" });
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = { authenticateUser };
