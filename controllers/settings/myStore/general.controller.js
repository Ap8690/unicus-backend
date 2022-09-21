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
    let generalObj = {};
    if(storeName) {
      generalObj = {...generalObj, storeName: storeName}
    }
    if(email) {
      generalObj = {...generalObj, email: email}
    }
    if(country) {
      generalObj = {...generalObj, country: country}
    }
    if(logoUrl) {
      generalObj = {...generalObj, logoUrl: logoUrl}
    }
    if(showInSuperMarket) {
      generalObj = {...generalObj, showInSuperMarket: showInSuperMarket}
    }
    if(marketPlaceAsHome) {
      generalObj = {...generalObj, marketPlaceAs}
    }
    if(showLanguage) {
      generalObj = {...generalObj, showLanguage: showLanguage}
    }
    if(locale) {
      generalObj = {...generalObj,locale: locale}
    }
    if(timeZone) {
      generalObj = {...generalObj, timeZone: timeZone}
    }
    if(dateFormat) {
      generalObj = {...generalObj, dateFormat: dateFormat}
    }
    if(timeFormat) {
      generalObj = {...generalObj, timeFormat: timeFormat}
    }
    if(showCookieConsent) {
      generalObj = {...generalObj, showCookieConsent: showCookieConsent}
    }
    if(cookieConsentText) {
      generalObj = {...generalObj, cookieConsentText: cookieConsent}
    }
    if(cookieInfoLink) {
      generalObj = {...generalObj, cookieInfoLink: cookieInfoLink}
    }
    if(showNewsLetter) {
      generalObj = {...generalObj, showNewsLetter: showNewsLetter}
    }
    if(showContactUs) {
      generalObj = {...generalObj, showContactUs: showContactUs}
    }
    if(phone) {
      generalObj = {...generalObj, phone: phone}
    }
    if(contactEmail) {
      generalObj = {...generalObj, contactEmail: contactEmail}
    }
    if(address) {
      generalObj = {...generalObj, address: address}
    }
    if(storeFees) {
      generalObj = {...generalObj, storeFees: storeFees}
    }
    if(secondaryStoreFees) {
      generalObj = {...generalObj, secondaryStoreFees: secondaryStoreFees}
    }
    if(storeWallet) {
      generalObj = {...generalObj, storeWallet: storeWallet}
    }
    if(Object.keys(generalObj).length === 0) {
      throw new Error("No data to update!")
    }

    const result = await General.findOneAndUpdate({"user": userId}, generalObj , {upsert: true})
    if(result){
      res.status(StatusCodes.OK).json({result})
    }
  }
  catch(err){
    res.status(StatusCodes.BAD_REQUEST).json({err: err.message});
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
    let socialLinks = {};

    if(facebook) {
      socialLinks = {...socialLinks, facebook}
    }
    if(instagram) {
      socialLinks = {...socialLinks, instagram}
    }
    if(discord) {
      socialLinks = {...socialLinks, discord}
    }
    if(pinterest) {
      socialLinks = {...socialLinks, pinterest}
    }
    if(reddit) {
      socialLinks = {...socialLinks, reddit}
    }
    if(behance) {
      socialLinks = {...socialLinks, behance}
    }
    if(telegram) {
      socialLinks = {...socialLinks, telegram}
    }
    if(linkedIn) {
      socialLinks = {...socialLinks, linkedIn}
    }
    if(twitter) {
      socialLinks = {...socialLinks, twitter}
    }
    if(portfolio) {
      socialLinks = {...socialLinks, portfolio}
    }
    if(youtube) {
      socialLinks = {...socialLinks, youtube}
    }
    if(dribble) {
      socialLinks = {...socialLinks,dribble}
    }
    if(stackoverflow) 
    socialLinks =  {...socialLinks, stackoverflow}

    if(Object.keys(socialLinks).length === 0) {
      throw new Error("No social links to update!")
    }

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
    res.status(StatusCodes.BAD_REQUEST).json({err:err?.message ? err : err.message});
  }
};

module.exports = {
  getGeneral,
  getSocialLinks,
  updateGeneral,
  updateSocialLinks
};