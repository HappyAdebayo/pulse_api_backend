const request = require("supertest");
const app = require("../app");
const db = require("../models");


describe("Workspace Transfer Ownership Flow",()=>{


let ownerToken;
let memberToken;

let owner;
let member;

let workspace;



beforeAll(async()=>{


// =====================
// CREATE OWNER
// =====================


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


owner = signup.body.data.user;



const login =
await request(app)
.post("/api/auth/login")
.send({
email:ownerEmail,
password:"password123"
});


ownerToken =
login.body.data.accessToken;



console.log("OWNER LOGIN",{
id:owner.id
});





// =====================
// CREATE WORKSPACE
// =====================


const workspaceResponse =
await request(app)
.post("/api/workspace")
.set(
"Authorization",
`Bearer ${ownerToken}`
)
.send({
name:`Workspace ${Date.now()}`,
description:"Ownership transfer test"
});


expect(workspaceResponse.statusCode)
.toBe(201);



workspace =
await db.Workspaces.findOne({
where:{
owner_id:owner.id
}
});





// =====================
// CREATE MEMBER
// =====================


const memberEmail =
`member${Date.now()}@test.com`;



const memberSignup =
await request(app)
.post("/api/auth")
.send({
name:"Workspace Member",
email:memberEmail,
password:"password123"
});


member =
memberSignup.body.data.user;





const memberLogin =
await request(app)
.post("/api/auth/login")
.send({
email:memberEmail,
password:"password123"
});


memberToken =
memberLogin.body.data.accessToken;




// =====================
// SEND INVITATION
// =====================


const invitationResponse =
await request(app)
.put(
`/api/workspace/${workspace.id}/invitation`
)
.set(
"Authorization",
`Bearer ${ownerToken}`
)
.send({
email:memberEmail,
role:"member"
});


expect(invitationResponse.statusCode)
.toBe(200);





// =====================
// ACCEPT INVITATION
// =====================


const invitation =
await db.WorkspaceInvitations.findOne({
where:{
workspace_id:workspace.id,
email:memberEmail
}
});



const accept =
await request(app)
.post(
`/api/workspace/invitation/${invitation.token}/accept`
)
.set(
"Authorization",
`Bearer ${memberToken}`
);



expect(accept.statusCode)
.toBe(200);



});





test("should transfer workspace ownership", async()=>{


const response =
await request(app)
.put(
`/api/workspace/${workspace.id}/transfer-ownership`
)
.set(
"Authorization",
`Bearer ${ownerToken}`
)
.send({
user_id:member.id
});
console.log(member);


console.log("TRANSFER RESPONSE", response.body);
expect(response.statusCode)
.toBe(200);



expect(response.body.message)
.toBe(
"Workspace ownership as been transferred"
);





// =====================
// CHECK WORKSPACE OWNER
// =====================


const updatedWorkspace =
await db.Workspaces.findByPk(
workspace.id
);



expect(updatedWorkspace.owner_id)
.toBe(member.id);





// =====================
// CHECK OLD OWNER ROLE
// =====================


const oldOwner =
await db.WorkspaceMembers.findOne({
where:{
workspace_id:workspace.id,
user_id:owner.id
}
});



expect(oldOwner.role)
.toBe("member");





// =====================
// CHECK NEW OWNER ROLE
// =====================


const newOwner =
await db.WorkspaceMembers.findOne({
where:{
workspace_id:workspace.id,
user_id:member.id
}
});



expect(newOwner.role)
.toBe("owner");





console.log("OWNERSHIP TRANSFER COMPLETE",{

oldOwner:{
id:owner.id,
role:oldOwner.role
},

newOwner:{
id:member.id,
role:newOwner.role
}

});



});



afterAll(async()=>{

await db.sequelize.close();

});


});