const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  try {
    // req.user = {userId: "62359ba99da5b992e9a11e29"};
    // return next();
    const accessToken = req.headers["authorization"];
    const bearerToken = accessToken.split(" ")[1];
    if (accessToken) {
      const payload = isTokenValid(bearerToken.trim());
      console.log("pa", payload);
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
