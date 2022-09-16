const mongoose = require("mongoose");
require("dotenv/config");

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME1}:${process.env.USER_PASS1}@cluster0.df1do.mongodb.net/RPC-Database?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch((err) => {
    console.log(err);
  });
