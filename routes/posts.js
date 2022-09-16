const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.get("/:id", async (req, res) => {
  try {
    const game = await req.database.getGameById(req.params.id, "test");
    res.json(game);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await req.database.createGame(req.body.name);
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/:id/join", async (req, res) => {
  try {
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/:id/move", async (req, res) => {
  try {
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
