const request = require("supertest");
const createApp = require("../app.js");

const getGameById = jest.fn();
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
  describe("Given a a body with a valid name", () => {
    const validBodyData = [
      { name: "Gustav", move: "rock" },
      { name: "jOnAtHaN", move: "saks" },
      { name: "X Æ A-12", move: "påse" },
    ];

    for (const body of validBodyData) {
      test(`responds with 201 created for name ${body.name}`, async () => {
        await request(app).post("/api/games/").send(body);
        expect(201);
      });
      test(`database.createGame is called once for name ${body.name}`, async () => {
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
