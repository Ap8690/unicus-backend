const Auction = require("./Auction");
const Bids = require("./Bids");
const NFTStates = require("./NFT-States");
const Nft = require("./Nft");
const Token = require("./Token");
const User = require("./User");
const WalletTransactions = require("./Wallet-Transactions");
const Storefront = require("./Storefront")
//Storefront
 const NameLogo = require( "./Settings/myStore/general/name");
 const BasicSettings = require( "./Settings/myStore/general/basic-settings");
 const Cookies = require( "./Settings/myStore/general/cookies");
 const SocialLink = require( "./Settings/myStore/general/socialinks");
 const ContactUs = require( "./Settings/myStore/general/contact-us");
 const StoreFees = require( "./Settings/myStore/general/store-fees");
 const Advance = require( "./Settings/myStore/advance/advance");
 const Analytics = require( "./Settings/myStore/analytics/analytics-integration");
 const Appearance = require( "./Settings/myStore/appearance/appearance");
 const Posts = require( "./Settings/myStore/blog/post");
 const Categories = require( "./Settings/myStore/blog/categories");
 const Seo = require( "./Settings/myStore/seo/seo");
 const Team =require( "./Settings/myStore/team/team");

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
