"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const AccessService = require("../../services/access.service");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

//sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
//sign in
router.post("/shop/login", asyncHandler(accessController.login));
module.exports = router;
