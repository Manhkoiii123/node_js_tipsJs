"use strict";

const keyTokenModel = require("../models/keyToken.model");
const mongoose = require("mongoose");
class KeyTokenServices {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //level 0
      // const publicKeyString = publicKey.toString(); //cái public key ban đầu sinh ra từ tt rsa => là buffer chứ ko phỉa là string => ép
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   // publicKey: publicKeyString,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null; //trả về public key string

      //level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          //nếu chưa có thì tạo mới , nếu có rồi thì update
          upsert: true,
          new: true,
        };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new mongoose.Types.ObjectId(userId) })
      .lean();
  };
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id).lean();
  };

  static findByRefreshTokenUsed = async (refToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refToken }).lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: new mongoose.Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenServices;
