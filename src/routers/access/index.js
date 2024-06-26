"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const AccessService = require("../../services/access.service");
const router = express.Router();

//sign up
router.post("/shop/signup", accessController.signUp);
//sign in

module.exports = router;
