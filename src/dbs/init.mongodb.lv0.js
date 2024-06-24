"use strict";

const mongoose = require("mongoose");
const connectString =
  "mongodb+srv://manhtranduc0202:manhtranduc0202@cluster0.zl3rya4.mongodb.net/";
mongoose
  .connect(connectString)
  .then((_) => console.log("connect mongodb success"))
  .catch((err) => console.log("connect error"));
//dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}
module.exports = mongoose;
