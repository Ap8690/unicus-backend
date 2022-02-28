const { Storefront } = require("../models");
const { parse } = require("tldts");
const domainParser = async (req, res, next) => {
  try{
  const url = req.header("Origin")
  const { subdomain, domain } = parse(url);
  if(domain != "unicus.one" || "herokuapp.com"){
    throw new CustomError.BadRequestError("Invalid Website");
  }
  if(!subdomain){
    throw new CustomError.BadRequestError("Invalid Website");
  }
  const storefront = await Storefront.find({domain: subdomain})
  req.storefront = storefront
  return next()
}
catch(err){
  console.log("err", err);
  res.status(err.statusCode).json({err: err.message})
}
}

module.exports= domainParser

