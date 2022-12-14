const express = require("express");
const router = express.Router();
const moves = require("../utils/languages.json");
const rpcOutcome = require("../utils/rpcOutcome.json");

function validateMove(move, moves) {
  for (moveType of Object.keys(moves)) {
    if (moves[moveType].includes(move.toLowerCase())) {
      return moveType;
    }
  }
  const error = new Error(`Move ${move} is not valid`);
  throw error;
}

//MongoDB either throws an error or returns brackets if the game does not excist
function validateGameExistance(game, gameId) {
  if (!game._id || game == []) {
    const error = new Error(`No game with ID: ${gameId} exists.`);
    throw error;
  }
}

function handlePlayerNotInTheGame(game, name) {
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

function isGameOver(game) {
  if (game.players.length > 1) {
    if (game.players[0].move && game.players[1].move) {
      return true;
    }
  }
  return false;
}

function checkDuplicateName(game, name) {
  for (var i of Object.keys(game.players)) {
    if (game.players[i].name === name) {
      const error = new Error(`Name: ${name} already in use in this game.`);
      throw error;
    }
  }
  return;
}

function checkForValidName(name) {
  if (!name || name === "") {
    const error = new Error(`Name: ${name} is invalid`);
    throw error;
  }
  return;
}

router.get("/:id", async (req, res, next) => {
  try {
    const game = await req.database.getGameById(req.params.id);
    if (isGameOver(game)) {
      res.json(game);
      return;
    }
    handlePlayerNotInTheGame(game, req.body.name);
    for (var i of Object.keys(game.players)) {
      //Hiding moves for other players
      if (game.players[i].name != req.body.name) {
        //Only hiding actual moves and not just empty fields
        if (!game.players[i].move || game.players[i].move == "") {
          continue;
        }
        game.players[i].move = "Hidden";
      }
    }
    res.json(game);
  } catch (err) {
    next(err);
  }
});

//Route for creating a new game.
router.post("/", async (req, res, next) => {
  try {
    checkForValidName(req.body.name);
    const data = await req.database.createGame(req.body.name);
    res.status(201);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

//Route for a player joining an excisting game.
router.post("/:id/join", async (req, res, next) => {
  try {
    const game = await req.database.getGameById(req.params.id);
    validateGameExistance(game, req.params.id);
    if (game.players.length > 1) {
      const error = new Error("The game is full");
      throw error;
    }
    checkForValidName(req.body.name);
    checkDuplicateName(game, req.body.name);
    const data = await req.database.playerJoinById(
      req.params.id,
      req.body.name
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

//Route for a player to perform a move after joining a game.
router.post("/:id/move", async (req, res, next) => {
  try {
    const move = validateMove(req.body.move, moves);
    const game = await req.database.getGameById(req.params.id);
    validateGameExistance(game, req.params.id);
    handlePlayerNotInTheGame(game, req.body.name);
    if (isGameOver(game) === true) {
      const error = new Error("The game is over.");
      throw error;
    }
    const data = await req.database.playerMoveById(
      req.params.id,
      req.body.name,
      move
    );
    //Checking if the game is over and determining a winnner.
    if (isGameOver(data) === true) {
      var winner = "";
      const outcome = String(
        rpcOutcome[data.players[0].move][data.players[1].move]
      );
      if (outcome === "tie") {
        winner = "tie";
      } else if (outcome === "winner") {
        winner = data.players[0].name;
      } else {
        winner = data.players[1].name;
      }
      const winnerData = await req.database.updateWinner(req.params.id, winner);
      res.json(winnerData);
      return;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
