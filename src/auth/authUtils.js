"use strict";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //taọ ra 1 acctoken qua cái private
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });
    // viết hàm verify sử dụng public token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("err verify :: ", err);
      } else {
        console.log("Decode verify :: ", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /* 
   1- check userid missing hay ko
   2. get acctoken 
   3. verrify token
   4. check user trong db 
   5. check keyStore với cái id này
   6. ok hết thì return next()
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found key store");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid user");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = {
  createTokenPair,
  authentication,
};
