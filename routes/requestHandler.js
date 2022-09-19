const express = require("express");
const router = express.Router();
const moves = require("../languages.json");
const rpcOutcome = require("../rpcOutcome.json");

function validateMove(move, moves) {
  for (moveType of Object.keys(moves)) {
    if (moves[moveType].includes(move.toLowerCase())) {
      return moveType;
    }
  }
  const error = new Error(`Move ${move} is not valid`);
  throw error;
}

function validateGame(game, gameId) {
  if (!game._id || game == []) {
    const error = new Error(`No game with ID: ${gameId} exists.`);
    throw error;
  }
}

function isNameInGame(game, name) {
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

//Checks iif the game is over
function isOver(game) {
  if (game.players.length > 1) {
    if (game.players[0].move && game.players[1].move) {
      return true;
    }
  }
  return false;
}

function checkDuplicateName(game, name) {
  if (name === "susan") {
    console.log("hmm");
  }
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
    const game = await req.database.getGameById(req.params.id, "test");
    if (isOver(game)) {
      res.json(game);
      return;
    }
    isNameInGame(game, req.body.name);
    for (var i of Object.keys(game.players)) {
      if (game.players[i].name != playerName) {
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
    //Validating gameId and duplicate names
    const game = await req.database.getGameById(req.params.id);
    validateGame(game, req.params.id);
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
    //Validating gameId, name, move and gamestate
    const move = validateMove(req.body.move, moves);
    const game = await req.database.getGameById(req.params.id);
    validateGame(game, req.params.id);
    isNameInGame(game, req.body.name);
    if (isOver(game) === true) {
      const error = new Error("The game is over.");
      throw error;
    }
    const data = await req.database.playerMoveById(
      req.params.id,
      req.body.name,
      move
    );
    //Checking if the game is over and determining a winnner.
    if (isOver(data) === true) {
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
