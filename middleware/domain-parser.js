const { Storefront } = require("../models");
const { parseDomain, fromUrl } = require("parse-domain");
const domainParser = async (req, res, next) => {
  const url = req.header("Origin")
  // const storefront = await Storefront.find({})
  const { subDomains, domain} = parseDomain(
    fromUrl(url)
  );
  console.log("url", url, subDomains, domain);
  return next()
}

module.exports={
  domainParser
}