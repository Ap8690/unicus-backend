const { StatusCodes } =require("http-status-codes");

const {Storefront, General, Advance, Appearance, User, Analytics, Seo} = require("../models");
const CustomError = require("../errors");
const { convertToLowercase, isReservedWord } = require("../utils/stringUtil");
const validator = require("validator");

const createStore = async (req, res) => {
  try {  
    const { storeName, email, logoUrl, country,chainName } = req.body.store;
    const owner = req.user.userId
    const subdomain = convertToLowercase(storeName)
    
    const userInfo = req.body.user;
    const emailTaken = await General.findOne({email})
    const regex = new RegExp(/^[a-z][a-z0-9-\s]*$/i);
    let domain = "";
    if (process.env.NODE_ENV === "prod") {
      domain = `${subdomain}.unicus.one`;
    } else if (process.env.NODE_ENV === "staging") {
      domain = `${subdomain}.demo.unicus.one`;
    } else if (process.env.NODE_ENV === "demo") {
      domain = `${subdomain}.demo.unicus.one`;
    } else {
      domain = `${subdomain}.test.unicus.one`;
    }

    const alreadyCreated = await Storefront.findOne({ domain });

    if(!domain || domain === ""){
      throw new CustomError.BadRequestError(
        "Domain name missing"
      );
    }
    if(!storeName || !regex.test(storeName)){
      throw new CustomError.BadRequestError(
        "Please enter store name. Only letters, numbers and - is allowed."
      );
    }
    if (!validator.isEmail(email)) {
      throw new CustomError.BadRequestError("Please enter valid email.");
    }
    if(alreadyCreated || isReservedWord(subdomain)){
      throw new CustomError.BadRequestError("Name not available.");
    }
    if(emailTaken){
      throw new CustomError.BadRequestError("Email already in use.");
    }

    if(owner && userInfo && owner == userInfo._id){
      const user = await User.findOne({_id: owner})
      if(!user){
        userInfo.doNotHash = true;
        const createUser = await User.create(userInfo)
        await User.updateOne({id:owner}, {doNotHash: false})
      }
    }
    else{
      res.status(StatusCodes.UNAUTHORIZED).json({err:"Unauthorized"})
    }


    const obj = {
      domain:[domain],
      owner,
      chainName
    }

    const createStore = await Storefront.create(obj);
    
    if(createStore) {
      const obj = {
        storeName,
        email,
        logoUrl,
        country,
        contactEmail:email,
        user: owner,
        storefront: createStore.id
      }
      try{
      const result = await General.create(obj);
      const resultAd = await Advance.create({user:owner, storefront:createStore.id})
      const resultApp = await Appearance.create({
        user: owner,
        storefront: createStore.id,
      });
      res.status(StatusCodes.OK).json({ createStore });
    }
      catch(err){
        console.log("err", err);
        await Storefront.deleteOne({ domain });
        await General.findOneAndDelete({ storefront: createStore.id });
        await Advance.findOneAndDelete({ storefront: createStore.id });
        await Appearance.findOneAndDelete({ storefront: createStore.id });
        res.json({ err });
      }
          
    }
  } catch (err) {
    console.log("err-store", err.message);
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
};

const getStoreByUser = async (req, res) =>{
  try{
    const owner = req.user.userId;
    const store = await Storefront.findOne({owner})
    if(store){
      res.status(StatusCodes.OK).json({store})
    }
    else{
      res.status(StatusCodes.OK).json({});
    }
  }
  catch(err){
    console.log("err", err.message);
    res.status(err.statusCode).json({ err: err.message });
  }
}

const getStoreDetails = async (req, res) =>{
  try{
    const storefront = req.storefront.id
    const general = await General.findOne({storefront})
    const advance = await Advance.findOne({ storefront });
    const appearance = await Appearance.findOne({ storefront });
    const analytics = await Analytics.findOne({ storefront });
    const seo = await Seo.findOne({ storefront });

    const store = {general, advance, appearance, analytics, seo}
    res.status(StatusCodes.OK).json({ store });
  }
  catch(err){
    console.log("err", err);
    res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
  }
}

module.exports = {
  createStore,
  getStoreByUser,
  getStoreDetails
};
