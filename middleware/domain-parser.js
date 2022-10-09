const { Storefront } = require("../models");
const { parse } = require("tldts");
const CustomError = require("./../errors");
const { StatusCodes } = require("http-status-codes");
const domainParser = async (req, res, next) => {
  try {
    const url = req.header("Origin");
    const { subdomain, domain, hostname } = parse(url);
    if (process.env.NODE_ENV !== "local") {
      if (domain != "unicus.one" &&
         domain != "herokuapp.com")  {
        req.storefront = { id: "624a951c1db000b674636777" };
      } else {
        const storefront = await Storefront.findOne({ domain: hostname });
        console.log("else storefront: ", storefront);
        req.storefront = storefront;
      }
      return next();
    } else {
      req.storefront = { id: "624a951c1db000b674636777" };
      return next();
    }
  } catch (err) {
    console.log("err-parser", err);
    res.status(StatusCodes.BAD_REQUEST).json(err.message);
  }
};

module.exports = domainParser;
