require("./databaseConnection");
const Game = require("../models/Game");
const Player = require("../models/Player");

async function getGameObjById(gameId) {
  try {
    const game = await Game.findById(gameId);
  } catch (err) {
    const error = new Error("No game with the ID:" + gameId);
    throw error;
  }
  return game;
}

function isPlayerNameInGame(game, name) {
  for (var i of Object.keys(game.players)) {
    if (game.players[i].name === name) {
      return;
    }
  }
  const error = new Error(
    "No player with that name in the game. Name: " + name
  );
  throw error;
}

function checkDuplicateName(game, name) {
  for (var i of Object.keys(game.players)) {
    if (game.players[i].name === name) {
      const error = new Error(
        "No player with that name in the game. Name: " + name
      );
      throw error;
    }
  }
  return;
}

function isMoveValid(move) {
  const validMoves = ["rock", "paper", "scissor"];
  //TODO
  for (i in validMoves) {
    if (validMoves[i] === move) {
      return true;
    }
  }
  const error = new Error("That move is not a valid move. Move: " + move);
  throw error;
}

//Function that checks iif the game is over
function isOver() {
  var gameOver = true;
  for (var i of Object.keys(game.players)) {
    if (!game.players[i].move) {
      gameOver = false;
    }
  }
  return gameOver;
}

const database = {
  getGameById: async function (gameId, playerName) {
    //Validating gameId and name. Hiding sensitive information.
    const game = await getGameObjById(gameId);
    if (isOver()) {
      return game;
    }
    isPlayerNameInGame(game, playerName);
    for (var i of Object.keys(game.players)) {
      if (game.players[i].name != playerName) {
        game.players[i].move = "Hidden";
      }
    }

    return game;
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
    //Validating gameId and duplicate names
    const game = await getGameObjById(gameId);
    checkDuplicateName();

    const player = new Player({
      name: String(playerName),
    });
    game.players.push(player);
    const data = await game.save();
    return data;
  },
  playerMoveById: async function (gameId, playerName, move) {
    //Validating gameId, name, move and gamestate
    const game = await getGameObjById(gameId);
    isPlayerNameInGame(game, playerName);
    isMoveValid(move);
    if (isOver(game) === true) {
      const error = new Error("The game is over.");
      throw error;
    }

    for (var i of Object.keys(game.players)) {
      if (game.players[i].name === playerName) {
        game.players[i].move = move;
      }
    }
    const data = await game.save();
    return data;
  },
};

module.exports = database;
