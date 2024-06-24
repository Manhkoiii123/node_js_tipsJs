"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

//count connnect
const countConnect = () => {
  const num = mongoose.connections.length;
  console.log("🚀 ~ countConnect ~ num:", num);
};

// check overload connect
const checkOverloadConnect = () => {
  setInterval(() => {
    const num = mongoose.connections.length;
    const numCores = os.cpus().length; // máy có bnh core
    const memoryUsage = process.memoryUsage().rss; // lấy số memory đã sử dụng
    //giả sử máy chịu được number of connect based on number of cores
    const maxConnectionns = numCores * 5; //chịu được 5 connect
    console.log("🚀 ~ setInterval ~ maxConnectionns:", maxConnectionns);

    console.log(`memory use ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Active connection ${num}`);

    if (num > maxConnectionns) {
      console.log("Connection overload detected!");
    }
  }, _SECOND); //moiotr every 5s
};

module.exports = {
  countConnect,
  checkOverloadConnect,
};
