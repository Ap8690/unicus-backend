const { getAdvance, updateAdvance } =require("../../../controllers/settings/myStore/advance.controller");

const { authenticateUser } = require("../../../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(getAdvance);

router.route("/").post(authenticateUser, updateAdvance);

module.exports = router;


