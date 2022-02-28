const { Storefront } = require("../models");
const { parse } = require("tldts");
const domainParser = async (req, res, next) => {
  const url = req.header("Origin")
  // const storefront = await Storefront.find({})
  const { subdomain, domain } = parse(url);
  console.log("url", url, subdomain, domain);
  return next()
}

module.exports= domainParser

