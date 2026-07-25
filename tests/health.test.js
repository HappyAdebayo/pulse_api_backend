const request = require("supertest");
const app = require("../app");


describe("Health check", () => {

  test("GET / should return API message", async () => {

    const response = await request(app)
      .get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
      .toBe("Welcome to pulse_api API backend");

  });

});