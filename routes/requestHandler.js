const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.get("/:id", async (req, res, next) => {
  try {
    const game = await req.database.getGameById(req.params.id, "test");
    res.json(game);
  } catch (err) {
    res.json({ message: err });
  }
});

//Route for creating a new game.
router.post("/", async (req, res) => {
  try {
    const data = await req.database.createGame(req.body.name);
    res.status(201);
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

//Route for a player joining an excisting game.
router.post("/:id/join", async (req, res) => {
  try {
    const game = await req.database.playerJoinById(
      req.params.id,
      req.body.name
    );
    res.status(201);
    res.json(game);
  } catch (err) {
    res.json({ message: err });
  }
});

//Route for a player to perform a move after joining a game.
router.post("/:id/move", async (req, res, next) => {
  try {
    const game = await req.database.playerMoveById(
      req.params.id,
      req.body.name,
      req.body.move
    );
    res.json(game);
  } catch (err) {
    console.log("being called");
    next(err);
  }
});

module.exports = router;
