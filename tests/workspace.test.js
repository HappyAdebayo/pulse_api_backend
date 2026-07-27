const request = require("supertest");
const app = require("../app");
const db = require("../models");

describe("Workspace API", () => {
  let accessToken;
  let user;

  beforeAll(async () => {
    const email = `workspace${Date.now()}@test.com`;

    // Create user
    const signup = await request(app)
    .post("/api/auth")
    .send({
      name: "Workspace User",
      email,
      password: "password123",
    });

      console.log("SIGNUP:", signup.statusCode, signup.body);
    // Login
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "password123",
      });

  console.log("LOGIN:", login.statusCode, login.body);
    accessToken = login.body.data.accessToken;
    // accessToken = login.body.data.refreshToken;
    user = login.body.data.user;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("should create a workspace", async () => {
    console.log(accessToken, 'accesstoken');
    
    const response = await request(app)
      .post("/api/workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Workspaces",
        description: "Integration test workspace",
      });

      console.log(response.statusCode, response.body, 'response');

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Workspace created");

     console.log(user,'user');
     
    const workspace = await db.Workspaces.findOne({
      where: {
        name: "Test Workspaces",
        owner_id: user.id,
      },
    });

    expect(workspace).not.toBeNull();

    const member = await db.WorkspaceMembers.findOne({
      where: {
        workspace_id: workspace.id,
        user_id: user.id,
      },
    });

    expect(member).not.toBeNull();
    expect(member.role).toBe("owner");
  });

  test("should fetch all user workspaces", async () => {
    const response = await request(app)
      .get("/api/workspace")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data.workspace)).toBe(true);
  });

  test("should not create duplicate workspace", async () => {
    const response = await request(app)
      .post("/api/workspace")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Test Workspaces",
        description: "Duplicate",
      });

    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe("Workspace already exist");
  });

  test("should delete workspace", async () => {
    const workspace = await db.Workspaces.findOne({
      where: {
        owner_id: user.id,
        name: "Test Workspaces",
      },
    });

    const response = await request(app)
      .delete(`/api/workspace/${workspace.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Workspace deleted successfully");

    const deletedWorkspace = await db.Workspaces.findByPk(workspace.id);

    expect(deletedWorkspace.deleted_at).not.toBeNull();
  });
});