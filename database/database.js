require("./databaseConnection");
const Game = require("../models/Game");

const database = {
  getGameById: async function (gameId, playerName) {
    console.log("called");
    //Only return relevant info
    const game = await Game.findById(gameId);
    console.log(game);
    return game;
  },
  createGame: async function (playerName) {
    const game = new Game({
      player1: {
        name: playerName,
      },
    });
    const data = await game.save();
    return data;
  },
};

/*
export async function createGame(playerName) {
  const game = new Game({
    player1: {
      name: playername,
    },
  });
  const data = await game.save();
  return data;
}

export async function joinGameById(gameId, playerName) {
  //insert into game where id matches
}

export async function moveGameById(gameId, move) {
  //insert into game where id amtches
}
*/
module.exports = database;
