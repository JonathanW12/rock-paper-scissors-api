const mongoose = require("mongoose");

const PlayerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  move: String,
});

module.exports = PlayerSchema;
