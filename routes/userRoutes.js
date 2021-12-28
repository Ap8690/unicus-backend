const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  getUserNonceByAddress,
} = require("../controllers/user.controller");

router.route("/").get(authenticateUser, getAllUsers);

router.route("/updateUserPassword").patch(authenticateUser, updateUser);

router.route("/:id").get(authenticateUser, getSingleUser);

router.route("/nonce/:publicAddress").get(getUserNonceByAddress);

module.exports = router;
