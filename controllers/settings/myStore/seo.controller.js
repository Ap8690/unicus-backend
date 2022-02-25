const { StatusCodes } = require("http-status-codes");
const { Seo } = require("../../../models");
const CustomError = require("./../../../errors");

const getSeo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await Seo.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

const updateSeo = async (req, res) => {
  try {
    const {
      metaTitle,
      metaKeyword,
      metaDescription,
      favicon,
      featuredImage,
      metaTags,
      robotTxt,
      excludeSite,
      sitemapHtml,
      sitemapXml,
      sitemapPagesXml,
      nftCollectionXml,
      nftItemsXml,
      usersXml,
      collectionRSSTitle,
      collectionRSSUrl,
      collectionRSSDescription,
      showCollectionFeed,
      assetsRSSTitle,
      assetsRSSUrl,
      assetsRSSDescription,
      showAssetsFeed,
      showAssetsSchema,
      showCollectionSchema
    } = req.body;
    const userId = req.user.userId;

    const obj = {
      metaTitle,
      metaKeyword,
      metaDescription,
      favicon,
      featuredImage,
      metaTags,
      robotTxt,
      excludeSite,
      sitemapHtml,
      sitemapXml,
      sitemapPagesXml,
      nftCollectionXml,
      nftItemsXml,
      usersXml,
      collectionRSSTitle,
      collectionRSSUrl,
      collectionRSSDescription,
      showCollectionFeed,
      assetsRSSTitle,
      assetsRSSUrl,
      assetsRSSDescription,
      showAssetsFeed,
      showAssetsSchema,
      showCollectionSchema,
      user: userId,
    };
    const result = await Seo.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

module.exports={
  getSeo,
  updateSeo
}
