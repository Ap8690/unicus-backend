const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  addBalance,
  updateUser,
  getUserById,
  getUserNonceByAddress,
} = require("../controllers/user.controller");

router.route("/").get(authenticateUser, getAllUsers);

router.route("/updateUserPassword").patch(authenticateUser, updateUser);

router.route("/:token").get(authenticateUser, getSingleUser);

router.route("/:id").get(authenticateUser, getUserById);

router.route("/balance/:amount").get(authenticateUser, addBalance);

router.route("/nonce/:publicAddress").get(getUserNonceByAddress);

module.exports = router;
