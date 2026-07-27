const request = require("supertest");
const app = require("../app");
const db = require("../models");


describe("Workspace Invitation Flow", () => {


  let accessToken;
  let invitedAccessToken;

  let user;
  let invitedUser;

  let workspace;



  beforeAll(async()=>{


    // =========================
    // CREATE OWNER
    // =========================


    const ownerEmail =
      `owner${Date.now()}@test.com`;



    const signup =
      await request(app)
      .post("/api/auth")
      .send({
        name:"Workspace Owner",
        email:ownerEmail,
        password:"password123"
      });



    expect(signup.statusCode)
      .toBe(201);



    user =
      signup.body.data.user;



    console.log("OWNER CREATED",{
      id:user.id,
      email:user.email
    });





    // =========================
    // OWNER LOGIN
    // =========================



    const login =
      await request(app)
      .post("/api/auth/login")
      .send({
        email:ownerEmail,
        password:"password123"
      });



    expect(login.statusCode)
      .toBe(200);



    accessToken =
      login.body.data.accessToken;



    console.log("OWNER LOGIN",{
      id:user.id,
      token:accessToken.substring(0,20)
    });



  });







  afterAll(async()=>{

    await db.sequelize.close();

  });









  test("should create workspace", async()=>{



    const response =
      await request(app)
      .post("/api/workspace")
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        name:"Test Workspace",
        description:"Testing workspace invitation"
      });




    expect(response.statusCode)
      .toBe(201);




    workspace =
      await db.Workspaces.findOne({
        where:{
          name:"Test Workspace",
          owner_id:user.id
        }
      });




    expect(workspace)
      .not
      .toBeNull();





    const ownerMember =
      await db.WorkspaceMembers.findOne({
        where:{
          workspace_id:workspace.id,
          user_id:user.id
        }
      });




    expect(ownerMember)
      .not
      .toBeNull();




    expect(ownerMember.role)
      .toBe("owner");




    console.log("WORKSPACE CREATED",{
      workspaceId:workspace.id,
      owner:user.id
    });



  });












  test("should create invited user and send invitation", async()=>{



    const email =
      `invite${Date.now()}@test.com`;




    // =========================
    // CREATE INVITED USER
    // =========================



    const signup =
      await request(app)
      .post("/api/auth")
      .send({
        name:"Invited User",
        email,
        password:"password123"
      });




    expect(signup.statusCode)
      .toBe(201);




    invitedUser =
      signup.body.data.user;




    console.log("INVITED USER CREATED",{
      id:invitedUser.id,
      email:invitedUser.email
    });








    // =========================
    // INVITED USER LOGIN
    // =========================



    const login =
      await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password:"password123"
      });




    expect(login.statusCode)
      .toBe(200);




    invitedAccessToken =
      login.body.data.accessToken;





    console.log("INVITED USER LOGIN",{
      id:invitedUser.id,
      token:invitedAccessToken.substring(0,20),
      email:invitedUser.email
    });









    // =========================
    // OWNER SEND INVITATION
    // =========================



    const response =
      await request(app)
      .put(
        `/api/workspace/${workspace.id}/invitation`
      )
      .set(
        "Authorization",
        `Bearer ${accessToken}`
      )
      .send({
        email,
        role:"member"
      });





    expect(response.statusCode)
      .toBe(200);






    const invitation =
      await db.WorkspaceInvitations.findOne({
        where:{
          workspace_id:workspace.id,
          email
        }
      });

    expect(invitation)
      .not
      .toBeNull();





    console.log("INVITATION CREATED",{
      id:invitation.id,
      token:invitation.token,
      email:invitation.email
    });



  });













  test("should accept invitation and create workspace member", async()=>{



    const invitation =
      await db.WorkspaceInvitations.findOne({
        where:{
          workspace_id:workspace.id,
          email:invitedUser.email
        }
      });


console.log("INVITATION DETAILS", {
    token: invitation.token,
    invitationEmail: invitation.email,
    workspaceId: invitation.workspace_id
});





    expect(invitation)
      .not
      .toBeNull();





    console.log("ACCEPT FLOW START",{
      invitationId:invitation.id,
      token:invitation.token,
      userId:invitedUser.id
    });







    const response =
      await request(app)
      .post(
        `/api/workspace/invitation/${invitation.token}/accept`
      )
      .set(
        "Authorization",
        `Bearer ${invitedAccessToken}`
      );






    expect(response.statusCode)
      .toBe(200);





    expect(response.body.message)
      .toBe(
        "Invitation accepted successfully"
      );







    const member =
      await db.WorkspaceMembers.findOne({
        where:{
          workspace_id:workspace.id,
          user_id:invitedUser.id
        }
      });






    expect(member)
      .not
      .toBeNull();






    expect(member.role)
      .toBe("member");






    console.log("INVITED USER JOINED WORKSPACE",{

      workspaceId:workspace.id,

      userId:invitedUser.id,

      role:member.role

    });





  });



});