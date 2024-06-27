"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    // kiểm tra trong header có tồn tại key ko
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(401).json({
        message: "Forbidden  Error",
      });
    }
    //check object key
    // viết service cho cái apiKey để tìm cái apiKey đó
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(401).json({
        message: "Forbidden  Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (per) => {
  //closure (hàm trả về 1 hàm  sử dụng được các biến của hàm cha được)
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission  denied",
      });
    }
    //kiểm tra permission có hợp lệ ko
    const validPermission = req.objKey.permissions.includes(per);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission  denied",
      });
    }
    return next();
  };
};
module.exports = {
  apiKey,
  permission,
};
