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
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid Token" });
      }

      req.user = payload;
      return next();
    } else {
      
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid Token" });
    }
  } catch (error) {
    console.log("err", error.message);
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = { authenticateUser };
