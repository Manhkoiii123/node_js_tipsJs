"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const AccessService = require("../../services/access.service");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
//sign in
router.post("/shop/login", asyncHandler(accessController.login));

//check atuthen đã
router.use(authentication);
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
module.exports = router;
