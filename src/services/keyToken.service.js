"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenServices {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString(); //cái public key ban đầu sinh ra từ tt rsa => là buffer chứ ko phỉa là string => ép
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? tokens.publicKey : null; //trả về public key string
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenServices;
