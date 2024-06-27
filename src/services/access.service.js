"use strict";

const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenServices = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const RoleShop = {
  SHOP: "SHOP",
  //WRITER:'00001', // nên để thế này nếu viết rõ thì ngta biết mất
  WRITER: "WRITER", //học thì viết thế này
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    //step 1 check emial tồn tại ko
    const holderShop = await shopModel.findOne({ email }).lean(); //lean giúp ta query nhanh
    // nếu ko có lean thì nó return cho ta 1 obj của mongoose chứa rất nheiefu tt thừa
    // có thì sẽ giảm được size của obj (trả về obj js thuần túy)
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10); // nên để 10 nếu để nhiều thì tốt hơn nhuwg tốn hơn

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenServices.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Key store error");
      }
      // const publicKeyObject = createPublicKey(publicKeyString);
      // tạo ra 1 cặp token
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}
module.exports = AccessService;
