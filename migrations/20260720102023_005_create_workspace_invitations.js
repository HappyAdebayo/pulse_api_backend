'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspace_invitations', {
      id: {
        type: Sequelize.UUID,
                primaryKey: true,
                // autoIncrement: true,
                unique: true,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      deleted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
                allowNull: false,
      },
      role: {
        type: Sequelize.STRING(255),
                allowNull: false,
                defaultValue: 'member',
      },
      token: {
        type: Sequelize.STRING(255),
                unique: true,
                allowNull: false,
      },
      status: {
        type: Sequelize.STRING(255),
                allowNull: false,
                defaultValue: 'pending',
      },
      expires_at: {
        type: Sequelize.DATE,
                allowNull: false,
      },
      accepted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      rejected_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workspace_invitations');
  }
};
