'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspaces', {
      id: {
        type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                // defaultValue: 'gen_random_uuid(',
      },
      deleted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
                allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
                allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'active',
      },
      settings: {
        type: Sequelize.JSONB,
                allowNull: true,
                defaultValue: {},
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
    await queryInterface.dropTable('workspaces');
  }
};
