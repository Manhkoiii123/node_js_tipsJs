require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//init db
require("./dbs/init.mongodb");
const { checkOverloadConnect } = require("./helpers/check.connect");
// checkOverloadConnect();
//init router
app.use("/", require("./routers"));
//handle error

module.exports = app;
