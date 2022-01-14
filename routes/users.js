const express = require("express");
const router = express.Router();

const {
  createUser, logIn
} = require("../controllers/users");

router.route("/signup").post(createUser);
router.route("/login").post(logIn);

module.exports = router;
