/*
const request = require("supertest");
const createApp = require("../app.js");

const validGameId = "testId1234";

const getGameById = jest.fn().mockImplementation((id) => {
  if (id === validGameId) {
    const res = { _id: validGameId, players: [{ name: "Gustav" }] };
    return res;
  }
});
const createGame = jest.fn();
const playerJoinById = jest.fn();
const playerMoveById = jest.fn();
const updateWinner = jest.fn();

const app = createApp({
  getGameById,
  createGame,
  playerJoinById,
  playerMoveById,
  updateWinner,
});
describe("Test for performing a move at POST/api/games/$id/move", () => {
  beforeEach(() => {
    createGame.mockClear();
  });
  describe("Given valid data to a game with 1 player", () => {
    const validBodyData = [
      { name: "Gustav", move: "rock" },
      { name: "Gustav", move: "paper" },
      { name: "Gustav", move: "scissors" },
      { name: "Gustav", move: "sten" },
      { name: "Gustav", move: "saks" },
      { name: "Gustav", move: "påse" },
    ];
    for (const body of validBodyData) {
      test(`responds with 200 succes for move: ${body.move}`, async () => {
        await request(app).post(`/api/games/${validGameId}/move`).send(body);
        expect(200);
      });
      test(`database.getGameById is called once for id ${validGameId}`, async () => {
        await request(app).post("/api/games/").send(body);
        expect(createGame.mock.calls.length).toBe(1);
      });
      test(`database.createGame gets passed the user name for name ${body.name}`, async () => {
        await request(app).post("/api/games/").send(body);
        expect(createGame.mock.calls[0][0]).toBe(body.name);
      });
      test(`responds with a game id for name ${body.name}`, async () => {
        const res = await request(app).post("/api/games/").send(body);
        expect(res.body._id).toBe("testId1234");
      });
    }
  });
  describe("Given a a body with an invalid name", () => {
    const invalidBodyData = [{ name: "" }, { name: 1 }, {}];
    for (body of invalidBodyData) {
      test(`responds with 400 bar request for name ${body.name}`, async () => {
        await request(app).post("/api/games/").send(body).expect(400);
        expect(400);
      });
      test(`database.createGame is never called for name ${body.name}`, async () => {
        await request(app).post("/api/games/").send(body);
        expect(createGame.mock.calls.length).toBe(0);
      });
    }
  });
});
*/
