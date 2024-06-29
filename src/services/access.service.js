"use strict";

const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenServices = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  //WRITER:'00001', // nên để thế này nếu viết rõ thì ngta biết mất
  WRITER: "WRITER", //học thì viết thế này
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  /* 
    1. check email
    2. check password
    3. create accToken,refToken
    4. generate token 
    5. getData retrun login
  */
  // cái refTOken này để mà khi fe call api login lại mà có login lại bảo các ae fe mang cái cookie theo => bảo rằng là thằng này trước đã login rồi => mang lên xóa cái cookie đó đi
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    //kiểm tra pass
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }
    //tạo token
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenServices.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

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
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenServices.removeKeyById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    //check token đã sử dụng chưa (trong model keyToken có refTokenUsed)
    const foundKey = await KeyTokenServices.findByRefreshTokenUsed(
      refreshToken
    );
    // nếu mà thấy => đưa vòa danh sách nghi vấn
    //nếu mà ch thấy thì cấp lại acctoken mới
    if (foundKey) {
      //decode xem mày là thằng nào có trong hệ thống ko
      // quay sang viết cái verify trogn authUtils
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundKey.privateKey
      );
      console.log("{ userId, email } [1] ::: ", { userId, email });
      // xóa trước đã
      // sang cái key service viết cái delete key
      await KeyTokenServices.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend! Please relogin");
    }
    //chưa có
    const holderToken = await KeyTokenServices.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registed 1");
    //verify token này
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("{ userId, email } [2] ::: ", { userId, email });
    //check user này có đúng ko
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed 2");
    // cấp token mới và đưa vào ref vào cái đã sử dụng
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // đã được sử dụng
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
}
module.exports = AccessService;
