const { StatusCodes } =require("http-status-codes");
const { Advance } = require("../../../models");
const CustomError = require("./../../../errors");

const getAdvance= async(req, res)=>{
  try{
    const userId = req.user.userId;
    const result = await Advance.findOne({ user: userId });
    res.status(StatusCodes.OK).json({ result });
  }
  catch(err){
    res.status(err.statusCode).json({ err: err.message });
  }
}

const updateAdvance = async (req, res) => {
  try {
    const {
      showEth,
      showPoly,
      showBinance,
      showCronos,
      showSeller,
      showBuyer,
      nftCategories,
      siteUrls,
      privacyPolicy,
      terms
    } = req.body;
    const userId = req.user.userId;

    
    const obj = { 
      showEth,
      showPoly,
      showBinance,
      showCronos,
      showSeller,
      showBuyer,
      nftCategories,
      siteUrls,
      privacyPolicy,
      terms,
      user: userId };
    const result = await Advance.findOneAndUpdate({ user: userId }, obj, {
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
  getAdvance,
  updateAdvance
}