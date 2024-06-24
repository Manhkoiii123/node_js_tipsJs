"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const connectString =
  "mongodb+srv://manhtranduc0202:manhtranduc0202@cluster0.zl3rya4.mongodb.net/";
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
        console.log("connect mongodb success promax", countConnect())
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
