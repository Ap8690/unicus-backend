const { StatusCodes } =require("http-status-codes");
const { NameLogo, BasicSettings, Cookies, SocialLink, ContactUs, StoreFees } =require("./../../../models");
const CustomError = require("./../../../errors");

const getNameLogo = async(req, res)=>{
  try{
  const userId = req.user.userId
  const storefront = req.storefront
  console.log("front", storefront);
  const result = await NameLogo.findOne({user: userId })
  res.status(StatusCodes.OK).json({result})
  }catch(err){
    console.log("err", err);
  }
};
const getBasicSettings = async (req, res) => {
   try {
     const userId = req.user.userId;
     const result = await BasicSettings.findOne({ user: userId });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
   }
};
const getCookies = async (req, res) => {
   try {
     const userId = req.user.userId;
     const result = await Cookies.findOne({ user: userId });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
   }
};
const getSocialLinks = async (req, res) => {
   try {
     const userId = req.user.userId;
     const result = await SocialLink.findOne({ user: userId });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
   }
};
const getContactUs = async (req, res) => {
   try {
     const userId = req.user.userId;
     const result = await ContactUs.findOne({ user: userId });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
   }
};
const getStoreFees = async (req, res) => {
   try {
     const userId = req.user.userId;
     const result = await StoreFees.findOne({ user: userId });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
   }
};

const updateNameLogo = async(req, res)=>{
  try{
    const {storeName, email, country, logoUrl} = req.body
    const userId = req.user.userId

    if(!storeName){
      throw new CustomError.BadRequestError("Store Name is required.");
    }
    const obj = {storeName, email, country, logoUrl, user:userId }
    const result = await NameLogo.findOneAndUpdate({"user": userId}, obj , {upsert: true})
    if(result){
      res.status(StatusCodes.OK).json({result})
    }
  }
  catch(err){
    res.status(err.statusCode).json({err: err.message});
  }
};
const updateBasicSettings = async (req, res) => {
   try {
     const {
       showInSuperMarket,
       marketPlaceAsHome,
       showLanguage,
       locale,
       timeZone,
       dateFormat,
       timeFormat
     } = req.body;
     const userId = req.user.userId;

     if (!locale) {
       throw new CustomError.BadRequestError("Locale is required.");
     }
    if (!timeZone) {
      throw new CustomError.BadRequestError("TimeZone is required.");
    }
    if (!dateFormat) {
      throw new CustomError.BadRequestError("Date format is required.");
    }
    if (!timeFormat) {
      throw new CustomError.BadRequestError("Time Format is required.");
    }
     const obj = {
       showInSuperMarket,
       marketPlaceAsHome,
       showLanguage,
       locale,
       timeZone,
       dateFormat,
       timeFormat,
       user: userId
     }
     const result = await BasicSettings.findOneAndUpdate({ user: userId }, obj, {
       upsert: true,
     });
     if (result) {
       res.status(StatusCodes.OK).json({ result });
     }
   } catch (err) {
     console.log("err", err);
   }
};
const updateCookies = async (req, res) => {
  try {
    const {
      showCookieConsent,
      cookieConsentText,
      infoLink    
    } = req.body;
    const userId = req.user.userId;

    if (showCookieConsent == null) {
      throw new CustomError.BadRequestError("Show Cookie Consent is required.");
    }
    if(typeof showCookieConsent !="boolean"){
      throw new CustomError.BadRequestError("Show Cookie Consent should be a boolean.");
    }
    if (showCookieConsent && !cookieConsentText) {
      throw new CustomError.BadRequestError("Cookie Consent text is required.");
    }
    if (showCookieConsent && !infoLink) {
      throw new CustomError.BadRequestError("More Info Link is required.");
    }
    
    const obj = {
      showCookieConsent,
      cookieConsentText,
      infoLink,
      user: userId
    };

    const result = await Cookies.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    console.log("err", err);
  }
};

const updateSocialLinks = async (req, res) => {
  try {
    const {
      facebook,
      instagram,
      discord,
      pinterest,
      reddit,
      behance,
      telegram,
      linkedIn,
      twitter,
      portfolio,
      youtube,
      dribble,
      stackoverflow
    } = req.body;
    const userId = req.user.userId;

    const obj = {
      facebook,
      instagram,
      discord,
      pinterest,
      reddit,
      behance,
      telegram,
      linkedIn,
      twitter,
      portfolio,
      youtube,
      dribble,
      stackoverflow,
      user: userId,
    };

    const result = await SocialLink.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    console.log("err", err);
  }
};
const updateContactUs = async (req, res) => {
  try {
    const { showNewsLetter, showContactUs, phone, email, address } = req.body;
    const userId = req.user.userId;

    if ( showContactUs==null || typeof showContactUs != "boolean") {
      throw new CustomError.BadRequestError(
        "Show Contact Us should be a boolean."
      );
    }
    if (showNewsLetter == null || typeof showNewsLetter != "boolean") {
      throw new CustomError.BadRequestError(
        "Show NewsLetter should be a boolean."
      );
    }
    if (showContactUs && (!phone || phone === "")) {
      throw new CustomError.BadRequestError(
        "Phone is required."
      );
    }
    if (showContactUs && (!email || email === "")) {
      throw new CustomError.BadRequestError("Email is required.");
    }

    const obj = {
      showNewsLetter, showContactUs, phone, email, 
      address,
      user: userId,
    };

    const result = await ContactUs.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    console.log("err", err);
  }
};
const updateStoreFees = async (req, res) => {
  try {
    const { storeFees, secondaryStoreFees, storeWallet } = req.body;
    const userId = req.user.userId;

    const obj = {
      storeFees, secondaryStoreFees, storeWallet,
      user: userId,
    };

    const result = await StoreFees.findOneAndUpdate({ user: userId }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = {
  getNameLogo,
  getBasicSettings,
  getCookies,
  getSocialLinks,
  getContactUs,
  getStoreFees,
  updateNameLogo,
  updateBasicSettings,
  updateCookies,
  updateSocialLinks,
  updateContactUs,
  updateStoreFees,
};