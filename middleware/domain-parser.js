const { Storefront } = require("../models");

const domainParser = async (req, res, next) => {
  const url = req.hostname
  const subdomain = req.headers.subdomain
  // const storefront = await Storefront.find({})
  console.log("url", url, subdomain);
  return next()
}

module.exports={
  domainParser
}