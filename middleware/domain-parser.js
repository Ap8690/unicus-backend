const { Storefront } = require("../models");

const domainParser = async (req, res, next) => {
  const url = req.get('host')
  const subdomain = req.subdomain
  // const storefront = await Storefront.find({})
  console.log("url", url, subdomain);
  return next()
}

module.exports={
  domainParser
}