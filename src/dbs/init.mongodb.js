"use strict";

const mongoose = require("mongoose");
const {
  db: { name },
} = require("../configs/config.mongodb");
const { countConnect } = require("../helpers/check.connect");
const connectString = `${process.env.MONGODB_URL}${name}`;
// console.log("🚀 ~ connectString:", connectString);
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 100,
      })
      .then((_) =>
        // console.log("connect mongodb success promax", countConnect())
        console.log("connect mongodb success")
      )
      .catch((err) => console.log("connect error"));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
