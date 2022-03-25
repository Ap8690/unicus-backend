const { Storefront } = require("../models");
const { parse } = require("tldts");
const CustomError = require("./../errors");
const { StatusCodes } = require("http-status-codes");
const domainParser = async (req, res, next) => {
  try{
  const url = req.header("Origin")
  const { subdomain, domain } = parse(url);
  // if(domain != "unicus.one" && domain!= "herokuapp.com"){
  //   throw new CustomError.BadRequestError("Invalid Website");
  // }
  // if(!subdomain){
  //   throw new CustomError.BadRequestError("Invalid domain");
  // }
  const storefront = await Storefront.findOne({domain: subdomain})
  req.storefront = { id: "6238773ffed785e2241a4a5f" };
    // req.storefront = storefront;
  return next()
}
catch(err){
  console.log("err", err);
  res.status(StatusCodes.BAD_REQUEST).json(err.message)
}
}

module.exports= domainParser

