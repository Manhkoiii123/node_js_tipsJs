"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId, //cái này lúc trong cái decode ở hàm authentication2
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
