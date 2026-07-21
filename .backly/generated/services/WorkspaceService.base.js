'use strict';

const db = require('../../../models');
const { generateSecurityCode } = require('../utils/security/codeGenerator');

/**
 * WorkspaceService.base.js
 * Generated Base Business logic for Workspace
 */

class WorkspaceServiceBase {
  async reject_invitation(input, user) {
    const foundInvitation = await db.WorkspaceInvitations.findOne({
      where: { [db.Sequelize.Op.and]: [ { token: input.params.tokenid }, { status: "pending" } ] },
    });

    if (!foundInvitation) {
      throw { status: 404, message: "Invitation not found"};
    }

    if (foundInvitation.email != user.email) {
      throw { status: 403, message: "This invitation does not belong to you"};
    }

    const currentDate = new Date();

    if (currentDate > foundInvitation.expires_at) {
      await db.WorkspaceInvitations.update({
        status: "expired"
      }, {
        where: { [db.Sequelize.Op.and]: [ { token: input.params.tokenid }, { email: user.email } ] },
      });
      throw { status: 409, message: "Invitation has expired"};
    }

    await db.WorkspaceInvitations.update({
      status: "rejected",
      rejected_at: currentDate
    }, {
      where: { [db.Sequelize.Op.and]: [ { email: user.email }, { token: input.params.tokenid }, { id: foundInvitation.id } ] },
    });
    return { status: 200, message: "User rejected invitation", data: {} };
  }

  async index(user) {
    const workspaceList = await db.WorkspaceMembers.findAll({
      where: { owner_id: user.id },
      include: [
        {
          model: db.Workspaces
        }
      ]
    });

    return { status: 200, message: "Workspace fetched succesfully", data: { workspace: { data: workspaceList } } };
  }

  async store(input, user) {
    const foundWorkspace = await db.Workspaces.findOne({
      where: { [db.Sequelize.Op.and]: [ { name: input.body.name }, { owner_id: user.id } ] },
    });

    if (foundWorkspace) {
      throw { status: 422, message: "Workspace already exist"};
    }

    const newWorkspace = await db.Workspaces.create({
      name: input.body.name,
      owner_id: user.id,
      description: input.body.description
    });

    await db.WorkspaceMembers.create({
      role: "owner",
      user_id: user.id,
      workspace_id: newWorkspace.id
    });

    return { status: 201, message: "Workspace created", data: {} };
  }

  async delete_workspace(input, user) {
    const foundWorkspace = await db.Workspaces.findOne({
      where: { id: input.params.id },
    });

    if (!foundWorkspace) {
      throw { status: 404, message: "Workspace not found"};
    } else if (foundWorkspace.owner_id != user.id) {
      throw { status: 403, message: "Only the workspace owner can delete this workspace"};
    }

    const deleteTransaction = await db.sequelize.transaction();
    try {
      await db.Workspaces.update(
        { deleted_at: new Date() },
        { where: { id: input.params.id , owner_id: user.id  }, transaction: deleteTransaction }
      );

      await db.WorkspaceInvitations.update(
        { deleted_at: new Date() },
        { where: { workspace_id: input.params.id }, transaction: deleteTransaction }
      );

      await db.WorkspaceMembers.update(
        { deleted_at: new Date() },
        { where: { workspace_id: input.params.id }, transaction: deleteTransaction }
      );

      await deleteTransaction.commit();
    } catch (transactionError) {
      await deleteTransaction.rollback();
      throw transactionError;
    }

    return { status: 200, message: "Workspace deleted successfully", data: {} };
  }

  async accept_invitation(input, user) {
    const foundInvitation = await db.WorkspaceInvitations.findOne({
      where: { [db.Sequelize.Op.and]: [ { token: input.params.tokenid }, { status: "pending" } ] },
    });

    if (!foundInvitation) {
      throw { status: 409, message: "invitation does not exist"};
    }

    const currentDate = new Date();

    if (currentDate > foundInvitation.expires_at) {
      await db.WorkspaceInvitations.update({
        status: "expired"
      }, {
        where: { token: input.params.tokenid },
      });
      throw { status: 400, message: "Bad Request"};
    } else if (foundInvitation.email != user.email) {
      throw { status: 403, message: "this invitation does not belong to you"};
    }

    const existingmemeber = await db.WorkspaceMembers.findOne({
      where: { [db.Sequelize.Op.and]: [ { user_id: user.id }, { workspace_id: foundInvitation.workspace_id } ] },
    });

    if (existingmemeber) {
      throw { status: 409, message: "You are already a member of this workspace"};
    }

    const transaction = await db.sequelize.transaction();
    try {
      await db.WorkspaceMembers.create({
        role: foundInvitation.role,
        user_id: user.id,
        workspace_id: foundInvitation.workspace_id
      }, { transaction: transaction });

      await db.WorkspaceInvitations.update({
        status: "accepted",
        accepted_at: currentDate
      }, {
        where: { [db.Sequelize.Op.and]: [ { token: input.params.tokenid }, { email: foundInvitation.email } ] },
        transaction: transaction
      });
      await transaction.commit();
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }

    return { status: 200, message: "Invitation accepted successfully", data: {} };
  }

  async transfer_ownership(input, user) {
    const foundWorkspace = await db.Workspaces.findOne({
      where: { id: input.params.workspaceid , owner_id: user.id  },
    });

    if (!foundWorkspace) {
      throw { status: 404, message: "Workspace not found"};
    }

    const newOwner = await db.WorkspaceMembers.findOne({
      where: { [db.Sequelize.Op.and]: [ { user_id: input.body.user_id }, { workspace_id: input.params.workspaceid } ] },
    });

    if (!newOwner) {
      throw { status: 404, message: "User is not a member of this workspace"};
    }

    if (input.body.user_id == user.id) {
      throw { status: 409, message: "You are already the owner"};
    }

    const updateTransaction = await db.sequelize.transaction();
    try {
      await db.WorkspaceMembers.update({
        role: "member"
      }, {
        where: { [db.Sequelize.Op.and]: [ { workspace_id: input.params.workspaceid }, { user_id: user.id } ] },
        transaction: updateTransaction
      });
      await db.WorkspaceMembers.update({
        role: "owner"
      }, {
        where: { [db.Sequelize.Op.and]: [ { user_id: input.body.user_id }, { workspace_id: input.params.workspaceid } ] },
        transaction: updateTransaction
      });
      await db.Workspaces.update({
        owner_id: input.body.user_id
      }, {
        where: { id: input.params.workspaceid },
        transaction: updateTransaction
      });
      await updateTransaction.commit();
    } catch (transactionError) {
      await updateTransaction.rollback();
      throw transactionError;
    }

    return { status: 200, message: "Workspace ownership as been transferred", data: {} };
  }

  async create_invitation(input, user) {
    const foundMember = await db.Workspaces.findOne({
      include: [
        {
          model: db.User
        }
      ],
      where: { email: input.body.email },
    });

    if (!foundMember) {
      throw { status: 404, message: "Users not found"};
    }

    const existingMember = await db.WorkspaceMembers.findOne({
      where: { [db.Sequelize.Op.and]: [ { workspace_id: input.params.workspaceid }, { user_id: foundMember.id } ] },
    });

    if (existingMember) {
      throw { status: 400, message: "User already belongs to this workspace"};
    }

    const foundOwner = await db.Workspaces.findOne({
      where: { [db.Sequelize.Op.and]: [ { owner_id: user.id }, { id: input.params.workspaceid } ] },
    });

    if (!foundOwner) {
      throw { status: 409, message: "You are not allowed to invite people"};
    }

    const tokenGenerated = generateSecurityCode({
      length: 12,
      charType: 'alphanumeric'
    });

    const currentDate = new Date();

    const expiry_date = new Date(currentDate.getTime() + (1 * 3600000)).toISOString();

    await db.WorkspaceInvitations.create({
      role: input.body.role,
      email: input.body.email,
      token: tokenGenerated,
      status: "pending",
      expires_at: expiry_date,
      workspace_id: input.params.workspaceid
    });

    return { status: 200, message: "Members added successfully", data: {} };
  }

}

module.exports = WorkspaceServiceBase;
