const { StatusCodes } =require("http-status-codes");
const {
  General,
  SocialLink,
} = require("./../../../models");
const CustomError = require("./../../../errors");

const getGeneral = async(req, res)=>{
  try{
  const storefront = req.storefront.id
  console.log("front", storefront);
  const result = await General.findOne({storefront})
  res.status(StatusCodes.OK).json({result})
  }catch(err){
    console.log("err", err);
  }
};

const getSocialLinks = async (req, res) => {
   try {
     const storefront = req.storefront.id;
     const result = await SocialLink.findOne({ storefront });
     res.status(StatusCodes.OK).json({ result });
   } catch (err) {
     console.log("err", err);
    res.status(StatusCodes.BAD_REQUEST).json({ err });
   }
};

const updateGeneral = async(req, res)=>{
  try{
    const {
      storeName,
      email,
      country,
      logoUrl,
      showInSuperMarket,
      marketPlaceAsHome,
      showLanguage,
      locale,
      timeZone,
      dateFormat,
      timeFormat,
      showCookieConsent,
      cookieConsentText,
      cookieInfoLink,
      showNewsLetter,
      showContactUs,
      phone,
      contactEmail,
      address,
      storeFees,
      secondaryStoreFees,
      storeWallet,
    } = req.body;
    const userId = req.user.userId
    console.log("loog", req.body);
    if(!storeName){
      throw new CustomError.BadRequestError("Store Name is required.");
    }
    if (showContactUs && (!phone || phone === "")) {
      throw new CustomError.BadRequestError("Phone is required.");
    }
    // if (!locale) {
    //   throw new CustomError.BadRequestError("Locale is required.");
    // }
    // if (!timeZone) {
    //   throw new CustomError.BadRequestError("TimeZone is required.");
    // }
    // if (!dateFormat) {
    //   throw new CustomError.BadRequestError("Date format is required.");
    // }
    // if (!timeFormat) {
    //   throw new CustomError.BadRequestError("Time Format is required.");
    // }
    //  if (showCookieConsent == null) {
    //    throw new CustomError.BadRequestError(
    //      "Show Cookie Consent is required."
    //    );
    //  }
    //  if (typeof showCookieConsent != "boolean") {
    //    throw new CustomError.BadRequestError(
    //      "Show Cookie Consent should be a boolean."
    //    );
    //  }
    //  if (showCookieConsent && !cookieConsentText) {
    //    throw new CustomError.BadRequestError(
    //      "Cookie Consent text is required."
    //    );
    //  }
    //  if (showCookieConsent && !infoLink) {
    //    throw new CustomError.BadRequestError("More Info Link is required.");
    //  }
    // if (showContactUs == null || typeof showContactUs != "boolean") {
    //   throw new CustomError.BadRequestError(
    //     "Show Contact Us should be a boolean."
    //   );
    // }
    // if (showNewsLetter == null || typeof showNewsLetter != "boolean") {
    //   throw new CustomError.BadRequestError(
    //     "Show NewsLetter should be a boolean."
    //   );
    // }
    // if (showContactUs && (!email || email === "")) {
    //   throw new CustomError.BadRequestError("Email is required.");
    // }
    const obj = {
      storeName,
      email,
      country,
      logoUrl,
      showInSuperMarket,
      marketPlaceAsHome,
      showLanguage,
      locale,
      timeZone,
      dateFormat,
      timeFormat,
      showCookieConsent,
      cookieConsentText,
      cookieInfoLink,
      showNewsLetter, 
      showContactUs, 
      phone, 
      contactEmail, 
      address,
      storeFees, 
      secondaryStoreFees, 
      storeWallet,
      user: userId,
    };
    const result = await General.findOneAndUpdate({"user": userId}, obj , {upsert: true})
    if(result){
      res.status(StatusCodes.OK).json({result})
    }
  }
  catch(err){
    res.status(err.statusCode).json({err: err.message});
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
    const storefront = req.storefront.id;

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

    const result = await SocialLink.findOneAndUpdate({ storefront }, obj, {
      upsert: true,
    });
    if (result) {
      res.status(StatusCodes.OK).json({ result });
    }
    else{
      res.status(StatusCodes.BAD_REQUEST).json("Request failed");
    }
  } catch (err) {
    console.log("err", err);
    res.status(StatusCodes.BAD_REQUEST).json({err:err.message});
  }
};

module.exports = {
  getGeneral,
  getSocialLinks,
  updateGeneral,
  updateSocialLinks
};