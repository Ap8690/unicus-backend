const CustomError = require("../errors");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");

const uploadToPinata = async (req, res) => {
  console.log("pinata");
try{
  const pinata = pinataSDK(
    "6aff73d61f9a9377963c",
    "5fe4bd174a6d80b442b67116f479e40aa6e53ec7a62ff9c8e6f3ff719d7363bb"
  );

  var data = req.body;
  const file = req.file;
  try {
    const P = file.path;
    console.log("P: ", P);
    var readableStreamForFile = fs.createReadStream(P);
    var options = {
      pinataMetadata: {
        name: `${data.name}.img`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    try {
      var result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    } catch (e) {
      console.log(e, "error");
    }
    console.log(result);
    data.image = "https://unicus.mypinata.cloud/ipfs/" + result.IpfsHash;
    data.attributes = JSON.parse(data.attributes)
    console.log(data);
    options = {
      pinataMetadata: {
        name: `${data.name}.json`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    try {
      result = await pinata.pinJSONToIPFS(data, options);
    } catch (e) {
      console.log(e, "error");
    }
    // delete image file
    fs.unlinkSync(P);
    res.send(result.IpfsHash);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
}catch(err){
  console.log(err);
}
};

module.exports = { uploadToPinata };