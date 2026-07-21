'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
                allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      name: {
        type: Sequelize.TEXT,
                allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
                unique: true,
                allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
                allowNull: false,
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
    await queryInterface.dropTable('user');
  }
};
