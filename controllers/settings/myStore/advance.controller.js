const { StatusCodes } =require("http-status-codes");
const { Advance } = require("../../../models");
const CustomError = require("./../../../errors");

const getAdvance= async(req, res)=>{
  try{
    const storefront = req.storefront.id;
    const result = await Advance.findOne({ storefront});
    res.status(StatusCodes.OK).json({ result });
  }
  catch(err){
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
}

const updateAdvance = async (req, res) => {
  try {
    const {
      showEth,
      showPoly,
      showBinance,
      showCronos,
      showSellerKyc,
      showBuyerKyc,
      nftCategories,
      siteUrls,
      privacyPolicy,
      terms,
      aboutUs,
      creators
    } = req.body;
    const userId = req.user.userId;
    const storefront = req.storefront.id
    let obj = {}

    if(showEth) {
      obj = {...obj, showEth}
    }
    if(showPoly) {
      obj = {...obj, showPoly}
    }
    if(showBinance) {
      obj = {...obj, showBinance}
    }
    if(showAva) {
      obj = {...obj, showAva}
    }
    if(showTron) {
      obj = {...obj, showTron}
    }
    if(showNear) {
      obj = {...obj, showNear}
    }
    if(showSolana) {
      obj = {...obj, showSolana}
    }
    if(showCronos) {
      obj = {...obj, showCronos}
    }
    if(showSellerKyc) {
      obj = {...obj, showSellerKyc}
    }
    if(showBuyerKyc) {
      obj = {...obj, showBuyerKyc}
    }
    if(nftCategories) {
      obj = {...obj, nftCategories}
    }
    if(siteUrls) {
      obj = {...obj, siteUrls}
    }
    if(privacyPolicy) {
      obj = {...obj, privacyPolicy}
    }
    if(terms) {
      obj = {...obj, terms}
    }
    if(aboutUs) {
      obj = {...obj, aboutUs}
    }
    if(creators) {
      obj = {...obj, creators}
    }
    if(userId) {
      obj = {...obj, user:userId}
    }
    const result = await Advance.findOneAndUpdate({ user: userId, storefront }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
};

const addCategory = async(req, res) =>{
  try{

  }
  catch(err){
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
}

module.exports={
  getAdvance,
  updateAdvance
}