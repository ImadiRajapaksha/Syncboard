const request = require("supertest");
require("./setup");
const { app } = require("../app");

describe("Auth routes", () => {
  const credentials = { email: "test@example.com", password: "password123" };

  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(credentials);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(credentials.email);
  });

  it("rejects duplicate registration", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app).post("/api/auth/register").send(credentials);
    expect(res.status).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app).post("/api/auth/login").send(credentials);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});