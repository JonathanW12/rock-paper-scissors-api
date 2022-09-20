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

  app.use(exposeDatabase);

  app.use("/api/games", requestHandler);

  app.use((req, res) => {
    //For invalid requests
    const error = new Error("Invalid request");
    error.statusCode = 404;
    throw error;
  });

  app.use("/", (error, req, res, next) => {
    res.status(error.status || 400);
    res.json({
      error: {
        message: error.message,
      },
    });
  });

  return app;
};

module.exports = createApp;
