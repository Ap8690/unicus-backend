const Auction = require("./Auction");
const Bids = require("./Bids");
const NFTStates = require("./NFT-States");
const Nft = require("./Nft");
const Token = require("./Token");
const User = require("./User");
const WalletTransactions = require("./Wallet-Transactions");
//Storefront
 const NameLogo = require( "./storefront/myStore/general/name");
 const BasicSettings = require( "./storefront/myStore/general/basic-settings");
 const Cookies = require( "./storefront/myStore/general/cookies");
 const SocialLink = require( "./storefront/myStore/general/socialinks");
 const ContactUs = require( "./storefront/myStore/general/contact-us");
 const StoreFees = require( "./storefront/myStore/general/store-fees");
 const Advance = require( "./storefront/myStore/advance/advance");
 const Analytics = require( "./storefront/myStore/analytics/analytics-integration");
 const Appearance = require( "./storefront/myStore/appearance/appearance");
 const Posts = require( "./storefront/myStore/blog/post");
 const Categories = require( "./storefront/myStore/blog/categories");
 const Seo = require( "./storefront/myStore/seo/seo");
 const Team =require( "./storefront/myStore/team/team");

module.exports = {
  Auction,
  Bids,
  NFTStates,
  Nft,
  Token,
  User,
  WalletTransactions,
  NameLogo,
  BasicSettings,
  Cookies,
  SocialLink,
  ContactUs,
  StoreFees,
  Advance,
  Analytics,
  Appearance,
  Posts,
  Categories,
  Seo,
  Team,
};
