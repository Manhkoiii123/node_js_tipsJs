const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
//init db
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
