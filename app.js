const express = require("express");
const bodyParser = require("body-parser");

const createApp = function (database) {
  const app = express();

  const exposeDatabase = (req, res, next) => {
    req.database = database;
    next();
  };

  app.use(bodyParser.json());
  const postRoutes = require("./routes/posts");
  const getRoutes = require("./routes/gets");

  app.use("/POST", exposeDatabase, postRoutes);
  app.use("/GET", getRoutes);

  return app;
};

module.exports = createApp;
