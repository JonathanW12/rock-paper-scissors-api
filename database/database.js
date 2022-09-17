const mongoose = require("mongoose");
require("./databaseConnection");
const Game = require("../models/Game");
const Player = require("../models/Player");

const database = {
  getGameById: async function (gameId, playerName) {
    //Only return relevant info
    const game = await Game.findById(gameId);
    return game;
  },
  createGame: async function (playerName) {
    const player = new Player({
      name: String(playerName),
    });
    console.log(player.name);
    const game = new Game();
    game.players.push(player);
    console.log(player);
    const data = await game.save();
    return data;
  },
  playerJoinById: async function (gameId, playerName) {
    const game = await Game.findById(gameId);
    game.player2.name = playerName;
    const data = await game.save();
    return data;
  },
  playerMoveById: async function (gameId, playerName, move) {
    const game = await Game.findById(gameId);
    if (playerName == game.player1.name) {
      game.player1.move = move;
    } else if (playerName == game.player2.name) {
      game.player2.move = move;
    } else {
      return { message: "There is no such player in the game" };
    }
    const data = await game.save();
    return data;
  },
};

module.exports = database;
