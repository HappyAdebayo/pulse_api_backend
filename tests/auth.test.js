const request = require("supertest");
const app = require("../app");

describe("Authentication API", () =>{
   
     test("should create a new user", async () => {
    const response = await request(app)
    .post("/api/auth/")
    .send({
        name: "Test User",
        email:"test@example.com",
        password: "password123"
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.message).toBe("User created successfully");
})

})


test("should login user and return tokens", async () =>{
    const response = await request(app)
    .post("/api/auth/login")
    .send({
        email:"test@example.com",
        password:"password123"
    })

    expect(response.statusCode).toBe(200);

    expect(response.body.data.accessToken).toBeDefined();

    expect(response.body.data.refreshToken).toBeDefined();
})

test("should reject wrong password", async () => {

 const response = await request(app)
 .post("/api/auth/login")
 .send({
   email:"test@example.com",
   password:"wrongpassword"
 });


 expect(response.statusCode)
 .toBe(409);

});

test("should logout user", async()=>{

 const login = await request(app)
 .post("/api/auth/login")
 .send({
   email:"test@example.com",
   password:"password123"
 });


 const refreshToken =
 login.body.data.refreshToken;


 const logout = await request(app)
 .post("/api/auth/logout")
 .send({
   refresh_token: refreshToken
 });


 expect(logout.statusCode)
 .toBe(200);

});


afterAll(async () => {
  await db.sequelize.close();
});