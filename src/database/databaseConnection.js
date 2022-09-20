const mongoose = require("mongoose");
require("dotenv/config");

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.df1do.mongodb.net/RPC-Database?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch((err) => {
    console.log(err);
  });
