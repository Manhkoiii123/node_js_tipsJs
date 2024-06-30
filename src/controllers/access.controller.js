"use strict";

const AccessService = require("../services/access.service");
const { CREATED, OK, SuccessResponse } = require("../core/success.response");
class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  handleRefreshToken = async (req, res, next) => {
    //ver 1
    // new SuccessResponse({
    //   message: "Refresh token successfully!",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);

    // ver2
    new SuccessResponse({
      message: "Refresh token successfully!",
      metadata: await AccessService.handleRefreshToken2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registed successfully!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
module.exports = new AccessController();
