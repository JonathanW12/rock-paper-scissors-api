const express = require("express");
const bodyParser = require("body-parser");

const createApp = function (database) {
  const app = express();

  const exposeDatabase = (req, res, next) => {
    req.database = database;
    next();
  };

  app.use(bodyParser.json());
  const requestHandler = require("./routes/requestHandler");

  app.use("/api/games", exposeDatabase, requestHandler);

  return app;
};

module.exports = createApp;
