const request = require("supertest");
const createApp = require("../src/app.js");

const completeGameId = "completeId1";
const incompleteGameId = "incomplete1";
const nonExistingGameId = "nonExistId";
const player1Name = "susan";
const player2Name = "marry";

const returnCompleteGame = () => {
  const res = {
    _id: completeGameId,
    winner: player1Name,
    players: [
      { name: player1Name, move: "rock" },
      { name: player2Name, move: "scissors" },
    ],
  };
  return res;
};
const returnInCompleteGame = () => {
  const res = {
    _id: incompleteGameId,
    winner: "Tp Be Decided",
    players: [{ name: player1Name, move: "rock" }, { name: player2Name }],
  };
  return res;
};
const returnNoGame = () => {
  const res = [];
  return res;
};

const getGameById = jest.fn((id) => {
  if (id === completeGameId) {
    return returnCompleteGame();
  } else if (id === incompleteGameId) {
    return returnInCompleteGame();
  }
  return returnNoGame();
});

const app = createApp({
  getGameById,
});

describe("Test for getting game info at GET/api/games/:id", () => {
  beforeEach(() => {
    getGameById.mockClear();
  });
  describe(`Getting all data back from a game with a complete game id: ${completeGameId}`, () => {
    test(`returns status code 200`, async () => {
      await request(app)
        .get(`/api/games/${completeGameId}`)
        .send({ name: player1Name, player1Name })
        .expect(200);
    });
    test(`returns all game data`, async () => {
      await request(app)
        .get(`/api/games/${completeGameId}`)
        .send({ name: player1Name, player1Name })
        .expect(200, returnCompleteGame());
    });
  });
  describe(`Getting relevent data back from a game with an incomplete game id: ${incompleteGameId}`, () => {
    test(`returns status code 200`, async () => {
      await request(app)
        .get(`/api/games/${incompleteGameId}`)
        .send({ name: player1Name })
        .expect(200);
    });
    test(`returns all game data for player: ${player1Name}`, async () => {
      await request(app)
        .get(`/api/games/${incompleteGameId}`)
        .send({ name: player1Name })
        .expect(200, returnInCompleteGame());
    });
    test(`returns hidden game data for player: ${player2Name}`, async () => {
      await request(app)
        .get(`/api/games/${incompleteGameId}`)
        .send({ name: player2Name })
        .expect(200, {
          _id: incompleteGameId,
          winner: "Tp Be Decided",
          players: [
            { name: player1Name, move: "Hidden" },
            { name: player2Name },
          ],
        });
    });
  });
  describe(`Handling non existing game ids for id: ${nonExistingGameId}`, () => {
    test(`returns status code 400`, async () => {
      await request(app)
        .get(`/api/games/${nonExistingGameId}`)
        .send({ name: player1Name, player1Name })
        .expect(400);
    });
  });
});
