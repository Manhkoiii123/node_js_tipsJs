"use strict";

const shopModel = require("../models/shop.model");
const { generateKeyPairSync, createPublicKey } = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenServices = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  //WRITER:'00001', // nên để thế này nếu viết rõ thì ngta biết mất
  WRITER: "WRITER", //học thì viết thế này
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1 check emial tồn tại ko
      const holderShop = await shopModel.findOne({ email }).lean(); //lean giúp ta query nhanh
      // nếu ko có lean thì nó return cho ta 1 obj của mongoose chứa rất nheiefu tt thừa
      // có thì sẽ giảm được size của obj (trả về obj js thuần túy)
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10); // nên để 10 nếu để nhiều thì tốt hơn nhuwg tốn hơn

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // tạo cho reftoken,accessToken
        // create privateKey(tạo xong cho ng dùng ko lưu trong db), public key (lưu để verify token)
        // nếu hacker truy cập được cái publickey cũng ko làm gì được vì ko có rivate key để sign token
        const { privateKey, publicKey } = generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", // là cái public key cryptoGraphy standards loại 1 là tiêu chuẩn cho bất đối xứng ngoài ra còn có pkcs8
            format: "pem", // là 1 định dạng mã hóa dạng định phân trog bảo mật
          },
          privateKeyEncoding: {
            type: "pkcs1", // là cái public key cryptoGraphy standards loại 1 là tiêu chuẩn cho bất đối xứng
            format: "pem", // là 1 định dạng mã hóa dạng định phân trog bảo mật
          },
        }); //cấp cho ta 2 thuộc tinnhs 1 là thuật toán 2 là modulesLength

        // console.log({ privateKey, publicKey }); // lưu vào collection KeyStore => tạo model keyotken

        const publicKeyString = await KeyTokenServices.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        console.log(
          "🚀 ~ AccessService ~ signUp= ~ publicKeyString:",
          typeof publicKeyString
        );

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }
        const publicKeyObject = createPublicKey(publicKeyString);
        // tạo ra 1 cặp token
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
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
    } catch (error) {
      return {
        code: "xxxxxxxx",
        message: error.message,
        status: "error",
      };
    }
  };
}
module.exports = AccessService;
