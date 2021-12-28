const express = require("express");
const {
  getAll,
  get,
  create,
  mintNFT,
  approveNFT,
} = require("../controllers/nft.controller");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const imageUpload = require("../middleware/image-upload");
const { uploadToPinata } = require("../middleware/upload-pinata");

router
  .route("/")
  .get(authenticateUser, getAll)
  .post(authenticateUser, imageUpload.single("image"), uploadToPinata, create);

router.route("/:id").get(authenticateUser, get);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);

module.exports = router;
