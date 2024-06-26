"use strict";
const JWT = require("jsonwebtoken");
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
module.exports = {
  createTokenPair,
};
