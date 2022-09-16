const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  //MongoDB creates an ID field which can be accessed once created.
  // _id: UUID.  The game-id can be accessed as such.
  player1: {
    name: {
      type: String,
      required: true,
    },
    moves: {
      type: [String],
    },
  },
  player2: {
    name: {
      type: String,
    },
    moves: {
      type: [String],
    },
  },
});

module.exports = mongoose.model("Game", GameSchema);
