'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('workspaces', 'owner_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('workspaces', {
      fields: ['owner_id'],
      type: 'foreign key',
      name: 'fk_workspaces_owner_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('workspace_invitations', 'workspace_id', {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('workspace_invitations', {
      fields: ['workspace_id'],
      type: 'foreign key',
      name: 'fk_workspace_invitations_workspace_id',
      references: {
        table: 'workspaces',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('workspace_members', 'workspace_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('workspace_members', {
      fields: ['workspace_id'],
      type: 'foreign key',
      name: 'fk_workspace_members_workspace_id',
      references: {
        table: 'workspaces',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('workspace_members', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('workspace_members', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_workspace_members_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('refresh_token', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    });
    await queryInterface.addConstraint('refresh_token', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_refresh_token_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('workspaces', 'fk_workspaces_owner_id');
    await queryInterface.removeColumn('workspaces', 'owner_id');
    await queryInterface.removeConstraint('workspace_invitations', 'fk_workspace_invitations_workspace_id');
    await queryInterface.removeColumn('workspace_invitations', 'workspace_id');
    await queryInterface.removeConstraint('workspace_members', 'fk_workspace_members_workspace_id');
    await queryInterface.removeColumn('workspace_members', 'workspace_id');
    await queryInterface.removeConstraint('workspace_members', 'fk_workspace_members_user_id');
    await queryInterface.removeColumn('workspace_members', 'user_id');
    await queryInterface.removeConstraint('refresh_token', 'fk_refresh_token_user_id');
    await queryInterface.removeColumn('refresh_token', 'user_id');
  }
};
