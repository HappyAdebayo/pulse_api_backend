'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('workspace_members', {
      id: {
        type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      deleted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('owner', 'admin', 'developer', 'member', 'viewer'),
                allowNull: true,
                defaultValue: 'member',
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
    await queryInterface.dropTable('workspace_members');
  }
};
