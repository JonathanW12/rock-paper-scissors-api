const request = require("supertest");
const createApp = require("../app.js");

const validId = "testId1234";
const inValidId = "testId5678";
const currentPlayer = "susan";
const path = String(`/api/games/${validId}/join`);

//Creates a default mock implementation and a mock implementation for the
//first two times the function is called
const getGameById = jest
  .fn()
  .mockImplementation((id) => {
    //Default mock implementation
    if (id === validId) {
      const res = {
        _id: validId,
        players: [{ name: currentPlayer, move: "saks" }],
      };
      return res;
    } else {
      //MongoDB returns an error or an empty array if there is no machting id.
      const res = [];
      return res;
    }
  })
  .mockImplementationOnce((id) => {
    //First time function is called
    if (id === validId) {
      const res = {
        _id: validId,
        players: [
          { name: currentPlayer, move: "saks" },
          { name: "abby", move: "sten" },
        ],
      };
      return res;
    } else {
      const res = [];
      return res;
    }
  })
  .mockImplementationOnce((id) => {
    //2nd time functon is called
    if (id === validId) {
      const res = {
        _id: validId,
        players: [
          { name: currentPlayer, move: "saks" },
          { name: "abby", move: "sten" },
        ],
      };
      return res;
    } else {
      const res = [];
      return res;
    }
  });
const createGame = jest.fn();
const playerJoinById = jest.fn().mockImplementation((id, uName) => {
  const res = {
    _id: validId,
    players: [{ name: currentPlayer, move: "saks" }, { name: uName }],
  };
  return res;
});
const playerMoveById = jest.fn();
const updateWinner = jest.fn();

const app = createApp({
  getGameById,
  createGame,
  playerJoinById,
  playerMoveById,
  updateWinner,
});

describe("Test for joining an existing game at POST/api/games/$id/join", () => {
  beforeEach(() => {
    getGameById.mockClear();
    playerJoinById.mockClear();
  });
  describe("A third players joins with a valid name and id", () => {
    const thirdPersonBodyData = { name: "ANNA", testId: validId };
    test(`responds with 400 bad request for id:  ${thirdPersonBodyData.testId}`, async () => {
      await request(app).post(path).send(thirdPersonBodyData).expect(400);
    });
    test(`database.createGame is never called for name ${thirdPersonBodyData.name}`, async () => {
      await request(app).post(path).send(thirdPersonBodyData);
      expect(playerJoinById.mock.calls.length).toBe(0);
    });
  });

  describe("Given a a body with a valid name and id", () => {
    const validBodyData = [
      { name: "Gustav", testId: validId },
      { name: "jOnAtHaN", testId: validId },
      { name: "X Æ A-12", testId: validId },
    ];

    for (const body of validBodyData) {
      test(`responds with 200 succes for name: ${body.name} and id: ${body.testId}`, async () => {
        await request(app).post(path).send(body).expect(200);
      });
      test(`database.playerJoinById is called once for name: ${body.name}`, async () => {
        await request(app).post(path).send(body);
        expect(playerJoinById.mock.calls.length).toBe(1);
      });
      test(`database.playerJoinById gets passed the user name for name: ${body.name}`, async () => {
        await request(app).post(path).send(body);
        expect(playerJoinById.mock.calls[0][0]).toBe(body.testId);
        expect(playerJoinById.mock.calls[0][1]).toBe(body.name);
      });
      test(`responds with a game id for name: ${body.name}`, async () => {
        const res = await request(app).post(path).send(body);
        expect(res.body._id).toBe(validId);
      });
    }
  });

  describe("Given a body with an invalid name but a valid id", () => {
    const invalidBodyDataName = [
      { name: "", testId: validId },
      { name: 1, testId: validId },
      { testId: validId },
      { name: String(currentPlayer), testId: validId },
    ];
    for (body of invalidBodyDataName) {
      test(`responds with 400 bad request for name: ${body.name}`, async () => {
        await request(app)
          .post(`/api/games/${body.testId}/join`)
          .send(body)
          .expect(400);
      });
      test(`database.createGame is never called for name: ${body.name}`, async () => {
        await request(app).post(`/api/games/${body.testId}/join`).send(body);
        expect(playerJoinById.mock.calls.length).toBe(0);
      });
    }
  });

  describe("Given a body with a valid name but an invalid id", () => {
    const invalidBodyData = [
      { name: "gustav", testId: inValidId },
      { name: "jonathan", testId: inValidId },
      { name: "Emma Watson The Third", testId: inValidId },
      { name: "ANNA", testId: inValidId },
    ];
    for (body of invalidBodyData) {
      test(`responds with 400 bad request for id:  ${body.testId}`, async () => {
        await request(app)
          .post(`/api/games/${body.testId}/join`)
          .send(body)
          .expect(400);
      });
      test(`database.createGame is never called for name ${body.name}`, async () => {
        await request(app).post(`/api/games/${body.testId}/join`).send(body);
        expect(playerJoinById.mock.calls.length).toBe(0);
      });
    }
  });
});
