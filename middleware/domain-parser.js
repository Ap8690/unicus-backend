const { Storefront } = require("../models");
const { parse } = require("tldts");
const CustomError = require("./../errors");
const { StatusCodes } = require("http-status-codes");
const domainParser = async (req, res, next) => {
  try{
  const url = req.header("Origin")
  const { subdomain, domain, hostname } = parse(url);
  console.log(
    "host",
    url,
    req.hostname,
    hostname,
    domain,
    process.env.NODE_ENV
  );
  if(process.env.NODE_ENV !=="local"){
    if(domain != "unicus.one" && domain!= "herokuapp.com"){
      throw new CustomError.BadRequestError("Invalid Website");
    }
    if(!subdomain){
      throw new CustomError.BadRequestError("Invalid domain");
    }
    const storefront = await Storefront.findOne({domain: hostname})
    req.storefront = storefront;
    return next()
  }
  else{
      req.storefront = { id: "624a951c1db000b674636777" };
      return next();
  }
}
catch(err){
  console.log("err-parser", err);
  res.status(StatusCodes.BAD_REQUEST).json(err.message)
}
}

module.exports= domainParser

