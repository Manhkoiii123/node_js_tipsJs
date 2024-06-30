"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const AccessService = require("../../services/product.service");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication2 } = require("../../auth/authUtils");
const router = express.Router();

//check atuthen đã
router.use(authentication2);
router.post("", asyncHandler(productController.createProduct));

module.exports = router;
