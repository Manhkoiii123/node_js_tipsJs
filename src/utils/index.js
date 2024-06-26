"use strict";

const _ = require("lodash");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields); // lấy các fileds nào trong object ra
};

module.exports = {
  getInfoData,
};
