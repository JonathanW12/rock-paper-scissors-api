require("./databaseConnection");
const Game = require("../models/Game");
const Player = require("../models/Player");

const databaseHandler = {
  getGameById: async function (gameId) {
    try {
      const game = await Game.findById(gameId);
      return game;
    } catch (err) {
      const error = new Error("No game with the ID:" + gameId);
      throw error;
    }
  },

  createGame: async function (playerName) {
    const player = new Player({
      name: String(playerName),
    });
    const game = new Game();
    game.players.push(player);
    const data = await game.save();
    return data;
  },

  playerJoinById: async function (gameId, playerName) {
    const game = await this.getGameById(gameId);
    const player = new Player({
      name: String(playerName),
    });
    game.players.push(player);
    const data = await game.save();
    return data;
  },

  playerMoveById: async function (gameId, playerName, move) {
    const game = await this.getGameById(gameId);

    for (var i of Object.keys(game.players)) {
      if (game.players[i].name === playerName) {
        game.players[i].move = move;
      }
    }
    const data = await game.save();
    return data;
  },

  updateWinner: async function (gameId, playerName) {
    const game = await this.getGameById(gameId);

    game.winner = playerName;
    const data = await game.save();
    return data;
  },
};

module.exports = databaseHandler;
