const Auction = require("./Auction");
const Bids = require("./Bids");
const NFTStates = require("./NFT-States");
const Nft = require("./Nft");
const Token = require("./Token");
const User = require("./User");
const WalletTransactions = require("./Wallet-Transactions");
const Storefront = require("./Storefront")
const Collection = require("./Collection");

//Storefront
 const General = require("./Settings/myStore/general/general")
 const SocialLink = require( "./Settings/myStore/general/socialinks");
 const Advance = require( "./Settings/myStore/advance/advance");
 const Analytics = require( "./Settings/myStore/analytics/analytics-integration");
 const Appearance = require( "./Settings/myStore/appearance/appearance");
 const Posts = require( "./Settings/myStore/blog/post");
 const Categories = require( "./Settings/myStore/blog/categories");
 const Seo = require( "./Settings/myStore/seo/seo");
 const Team =require( "./Settings/myStore/team/team");

 const NotificationSettings = require("./Settings/MyAccount/NotificationSettings")

module.exports = {
  Auction,
  Bids,
  NFTStates,
  Nft,
  Token,
  User,
  Collection,
  WalletTransactions,
  Storefront,
  General,
  SocialLink,
  Advance,
  Analytics,
  Appearance,
  Posts,
  Categories,
  Seo,
  Team,
  NotificationSettings,
};
