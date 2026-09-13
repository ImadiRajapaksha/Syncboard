const request = require("supertest");
require("./setup");
const { app } = require("../app");
const Board = require("../models/Board");

async function getToken() {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email: `user${Date.now()}@example.com`, password: "password123" });
  return res.body.token;
}

describe("Protected routes", () => {
  it("rejects requests with no token", async () => {
    const res = await request(app).get("/api/boards");
    expect(res.status).toBe(401);
  });

  it("rejects requests with an invalid token", async () => {
    const res = await request(app).get("/api/boards").set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });
});

describe("Board and task flow", () => {
  let token;
  let board;

  beforeEach(async () => {
    token = await getToken();
    board = await Board.create({
      name: "Test Board",
      columns: [{ id: "todo", title: "To Do" }, { id: "done", title: "Done" }],
    });
  });

  it("gets all boards", async () => {
    const res = await request(app).get("/api/boards").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("gets board columns with tasks", async () => {
    const res = await request(app)
      .get(`/api/boards/${board._id}/columns`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("tasks");
  });

  it("creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ boardId: board._id, columnId: "todo", title: "New task" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("New task");
    expect(res.body.version).toBe(0);
  });

  it("updates a task with the correct version", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ boardId: board._id, columnId: "todo", title: "Task" });

    const res = await request(app)
      .put(`/api/tasks/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated task", version: 0 });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated task");
    expect(res.body.version).toBe(1);
  });

  it("returns 409 when updating with a stale version", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ boardId: board._id, columnId: "todo", title: "Task" });

    await request(app)
      .put(`/api/tasks/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First update", version: 0 });

    const res = await request(app)
      .put(`/api/tasks/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Second update", version: 0 });

    expect(res.status).toBe(409);
  });

  it("deletes a task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ boardId: board._id, columnId: "todo", title: "Task" });

    const res = await request(app)
      .delete(`/api/tasks/${created.body._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});