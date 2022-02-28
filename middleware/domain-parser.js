const { Storefront } = require("../models");

const domainParser = async (req, res, next) => {
  const url = req.header("Origin")
  const subdomain = req.subdomains
  // const storefront = await Storefront.find({})
  console.log("url", url, subdomain);
  return next()
}

module.exports={
  domainParser
}