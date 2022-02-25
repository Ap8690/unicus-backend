const Auction = require("./Auction");
const Bids = require("./Bids");
const NFTStates = require("./NFT-States");
const Nft = require("./Nft");
const Token = require("./Token");
const User = require("./User");
const WalletTransactions = require("./Wallet-Transactions");
const Storefront = require("./Storefront")
//Storefront
 const NameLogo = require( "./settings/myStore/general/name");
 const BasicSettings = require( "./settings/myStore/general/basic-settings");
 const Cookies = require( "./settings/myStore/general/cookies");
 const SocialLink = require( "./settings/myStore/general/socialinks");
 const ContactUs = require( "./settings/myStore/general/contact-us");
 const StoreFees = require( "./settings/myStore/general/store-fees");
 const Advance = require( "./settings/myStore/advance/advance");
 const Analytics = require( "./settings/myStore/analytics/analytics-integration");
 const Appearance = require( "./settings/myStore/appearance/appearance");
 const Posts = require( "./settings/myStore/blog/post");
 const Categories = require( "./settings/myStore/blog/categories");
 const Seo = require( "./settings/myStore/seo/seo");
 const Team =require( "./settings/myStore/team/team");

module.exports = {
  Auction,
  Bids,
  NFTStates,
  Nft,
  Token,
  User,
  WalletTransactions,
  Storefront,
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
