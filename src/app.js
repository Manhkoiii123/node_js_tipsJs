const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init db
require("./dbs/init.mongodb");
const { checkOverloadConnect } = require("./helpers/check.connect");
// checkOverloadConnect();
//init router
app.get("/", (req, res, next) => {
  const strCompress = "hello manhtranduc";
  return res.status(200).json({
    message: "Welcome",
    metadata: strCompress.repeat(10000),
  });
});
//handle error

module.exports = app;
