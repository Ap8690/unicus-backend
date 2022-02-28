const { StatusCodes } =require("http-status-codes");

const {Storefront, NameLogo} = require("../models");
const CustomError = require("../errors");
const { convertToLowercase } = require("../utils/stringUtil");

const createStore = async (req, res) => {
  try {
    const owner = req.user.userId;
    const { storeName, logoUrl } = req.body;
    const domain = convertToLowercase(storeName)

    const alreadyCreated = await Storefront.findOne({domain})
    console.log("alr", alreadyCreated);
    if(alreadyCreated){
      throw new CustomError.BadRequestError("Name not available.");
    }


    const obj = {
      domain,
      owner
    }

    const createStore = await Storefront.create(obj);
    console.log("cre", createStore);
    
    if(createStore) {
      const obj = {
        domain,
        logoUrl,
        user: owner,
        storefront: createStore.id
      }
      const result = await NameLogo.findOneAndUpdate(
            { user: owner },
            obj,
            { upsert: true }
          );
          console.log("res", result);
          if(result){
            res.status(StatusCodes.OK).json({createStore})
          }
    }
  } catch (err) {
    res.status(err.statusCode).json({ err: err.message });
  }
};

module.exports={
  createStore
};
