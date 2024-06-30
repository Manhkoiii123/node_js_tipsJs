"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electionics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: {
      type: Schema.Types.Mixed, //loại hỗn hợp
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// module.exports = model(DOCUMENT_NAME, productSchema);

//các sản phẩm con thì sao defined clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);
const electronicSchema = new Schema(
  {
    manufactory: {
      type: String,
      required: true,
    },
    modal: String,
    color: String,
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model("Electronics", electronicSchema),
  clothing: model("Clothing", clothingSchema),
};
