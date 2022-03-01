const CustomError = require("../errors");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");

const uploadToPinata = async (req, res) => {
  console.log("pinata")

  const pinata = pinataSDK(
    "6aff73d61f9a9377963c",
    "5fe4bd174a6d80b442b67116f479e40aa6e53ec7a62ff9c8e6f3ff719d7363bb"
  );

  //   pinata
  //     .testAuthentication()
  //     .then((result) => {
  //       //handle successful authentication here
  //       console.log(`Authentication successful ---->`, result);
  //     })
  //     .catch((err) => {
  //       //handle error here
  //       console.log(err);
  //     });

  var data = req.body;
  const file = req.file;
  try {
    if (!file) {
      throw new Error("Please upload an image");
    }

    var readableStreamForFile = fs.createReadStream(file.path);

    var options = {
      pinataMetadata: {
        name: `${data.name}.img`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    try {
      var ipfsResult = await pinata.pinFileToIPFS(
        readableStreamForFile,
        options
      );
    } catch (e) {
      throw new Error(`Error occurred while pin file to IPFS ${e}`);
    }
    const unicusUrl = "https://unicus.mypinata.cloud/ipfs/";
    data.imageIpfs = unicusUrl + ipfsResult.IpfsHash;
    // req.body.imageIpfs = data.image;
    options = {
      pinataMetadata: {
        name: `${data.name}.json`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    try {
      jsonResult = await pinata.pinJSONToIPFS(data, options);
    } catch (e) {
      console.log(e, "error");
      throw new Error("Error occurred while pin JSON to IPFS");
    }
    data.jsonIpfs = unicusUrl + jsonResult.IpfsHash;
    // req.body.jsonIpfs = unicusUrl + jsonResult.IpfsHash;
  } catch (err) {
    console.log(err);
    throw new CustomError.BadRequestError(err);
  }
};

module.exports = { uploadToPinata };
