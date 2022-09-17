const mongoose = require("mongoose");
const PlayerSchema = require("./PlayerSchema");

const GameSchema = mongoose.Schema({
  //MongoDB creates an ID field which can be accessed once created.
  players: {
    type: [PlayerSchema],
    validate: [
      (val) => {
        return val.length <= 2;
      },
      "Exceeds the limit of 2 players",
    ],
  },
  gameCreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Game", GameSchema);
